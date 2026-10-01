import assert from 'node:assert/strict';
import { readFile, mkdir } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
import { chromium, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { isolatedSite } from './isolated-site.mjs';

process.env.ASTRO_TELEMETRY_DISABLED = '1';
const { build, preview } = await import('astro');
const fixtureSource = await readFile(new URL('./fixtures/projects.ts', import.meta.url), 'utf8');
const fixturePairs = [
  ['/es/proyectos/fixture-privado/', '/en/projects/fixture-private/'],
  ['/es/proyectos/fixture-demostracion/', '/en/projects/fixture-demo/'],
  ['/es/proyectos/fixture-vacio/', '/en/projects/fixture-empty/'],
];
const samplePairs = [
  ['/es/proyectos/automatizacion/', '/en/projects/automation/'],
  ['/es/proyectos/producto-web/', '/en/projects/web-product/'],
  ['/es/proyectos/backend/', '/en/projects/backend/'],
];
const browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL || 'msedge' });
await mkdir('artifacts', { recursive: true });
let sweeps = 0;
try {
  for (const mode of ['mixed', 'real-only', 'single']) {
    const site = await isolatedSite(`projects-${mode}`);
    await site.write('tests/fixtures/projects.ts', fixtureSource);
    const original = await site.read('src/data/projects.ts');
    const list = mode === 'mixed' ? '[...samples, ...realFixtures]' : mode === 'single' ? '[realFixtures[0]!]' : 'realFixtures';
    await site.write('src/data/projects.ts', `${original.replace('export const projects: Project[]', 'const samples: Project[]')}\nimport { realFixtures } from '../../tests/fixtures/projects';\nexport const projects: Project[] = ${list};\n`);
    // A generated raster fixture, kept entirely outside public/ in the real site.
    const assetPage = await browser.newPage({ viewport: { width: 960, height: 540 } });
    await assetPage.setContent('<html lang="en"><body style="margin:0;background:#283b52;color:#eef3f8;font:32px sans-serif;padding:60px"><h1>TEST FIXTURE</h1><p>Synthetic screenshot · no real project data</p></body></html>');
    await site.write('public/images/projects/fixture.png', await assetPage.screenshot());
    await assetPage.close();
    if (mode === 'mixed') {
      const check = await promisify(execFile)(process.execPath, [fileURLToPath(new URL('../scripts/astro.mjs', import.meta.url)), 'check'], { cwd: site.root, env: process.env });
      assert.match(check.stdout, /0 errors/);
      console.log('PASS: Astro/TypeScript checks fixtures imported through project data.');
    }
    await build(site.config);
    const server = await preview({ ...site.config, server: { host: '127.0.0.1', port: 4338 } });
    const origin = `http://127.0.0.1:${server.port}`;
    const context = await browser.newContext({ baseURL: origin });
    // Never request external fixture destinations; links are inspected, not followed.
    await context.route('**/*', route => new URL(route.request().url()).origin === origin ? route.continue() : route.abort());
    const page = await context.newPage();
    const errors = [];
    const knownCspWarning = "The Content-Security-Policy directive 'script-src' contains the keyword 'none' alongside with other source expressions. The keyword 'none' must be the only source expression in the directive value, otherwise it is ignored.";
    let cspWarnings = 0;
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => {
      if (message.type() !== 'error') return;
      if (message.text() === knownCspWarning) cspWarnings++;
      else errors.push(message.text());
    });
    try {
      const pairs = mode === 'mixed' ? [...samplePairs, ...fixturePairs] : mode === 'single' ? fixturePairs.slice(0, 1) : fixturePairs;
      for (const [langIndex, lang] of ['es', 'en'].entries()) {
        await page.goto(`/${lang}/`);
        await expect(page.locator('.project-link')).toHaveCount(pairs.length);
        await expect(page.locator('.preview-note, .sample-footnote')).toHaveCount(mode === 'mixed' ? 2 : 0);
        await expect(page.locator('.project-sample')).toHaveCount(mode === 'mixed' ? 3 : 0);
        for (const selector of ['meta[name="description"]', 'meta[property="og:description"]']) {
          const description = await page.locator(selector).getAttribute('content');
          assert.equal(/muestra|sample/i.test(description), mode === 'mixed');
        }
        for (const [index, pair] of pairs.entries()) {
          const path = pair[langIndex];
          await page.goto(`/${lang}/`);
          await page.locator(`.project-link[href="${path}"]`).click();
          await expect(page).toHaveURL(`${origin}${path}`);
          const sample = mode === 'mixed' && index < 3;
          await expect(page.locator('.case-notice, .case-header .sample-badge')).toHaveCount(sample ? 2 : 0);
          assert.equal(/muestra|sample/i.test(await page.title()), sample);
          for (const selector of ['meta[name="description"]', 'meta[property="og:description"]']) {
            assert.equal(/muestra|sample/i.test(await page.locator(selector).getAttribute('content')), sample);
          }
          await expect(page.locator('.next-case')).toHaveCount(mode === 'single' ? 0 : 1);
          if (mode !== 'single') {
            await expect(page.locator('.next-case')).toHaveAttribute('href', pairs[(index + 1) % pairs.length][langIndex]);
          }
          if (path.includes('fixture-priv')) {
            await expect(page.locator('.actual-results li')).toHaveCount(1);
            await expect(page.locator('.evidence-section, .result-value, .architecture-section, .decisions-section, .case-columns')).toHaveCount(0);
            await expect(page.locator('.case-meta dt')).toHaveCount(1);
          } else if (path.includes('fixture-demo')) {
            await expect(page.locator('.evidence-links a')).toHaveCount(2);
            for (const link of await page.locator('.evidence-links a').all()) {
              assert.match(await link.getAttribute('href'), /^https:\/\/example\.com\//);
              await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
              await expect(link).toHaveAttribute('target', '_blank');
            }
            await expect(page.locator('.result-value')).toHaveText('12');
            await expect(page.locator('.flow-diagram li')).toHaveCount(2);
            await expect(page.locator('.architecture-section figcaption, .validation-section')).toHaveCount(0);
            const img = page.locator('.project-screenshot img');
            await img.scrollIntoViewIfNeeded();
            await expect(img).toHaveAttribute('alt', lang === 'es' ? 'Imagen sintética para probar una captura' : 'Synthetic image to test a screenshot');
            await expect.poll(() => img.evaluate(el => el.complete && el.naturalWidth > 0)).toBe(true);
            await expect(page.locator('.project-screenshot figcaption')).toHaveCount(lang === 'es' ? 1 : 0);
          } else if (path.includes('fixture-vacio') || path.includes('fixture-empty')) {
            await expect(page.locator('.case-content section, .evidence-links, .case-content img')).toHaveCount(0);
            await expect(page.locator('.case-meta dt')).toHaveCount(1);
          }
          await page.getByRole('link', { name: lang === 'es' ? 'English' : 'Español', exact: true }).click();
          await expect(page).toHaveURL(`${origin}${pair[1 - langIndex]}`);
          await page.reload();
          await page.goBack();
          await expect(page).toHaveURL(`${origin}${path}`);
          await page.locator('.back-link').click();
          await expect(page).toHaveURL(`${origin}/${lang}/#projects`);
          await page.goBack();
          await expect(page).toHaveURL(`${origin}${path}`);
          await page.goForward();
          await expect(page).toHaveURL(`${origin}/${lang}/#projects`);
        }
      }
      if (mode !== 'single') {
        for (const width of [320, 390, 768, 1024, 1440]) {
          await page.setViewportSize({ width, height: width === 1024 ? 768 : 1024 });
          for (const path of ['/es/', '/en/', ...fixturePairs.flat()]) {
            const response = await page.goto(path);
            assert.equal(response.status(), 200);
            assert.match(response.headers()['content-security-policy'], /frame-ancestors 'none'/);
            assert.match(response.headers()['content-security-policy'], /(?:^|; )script-src 'none'(?:;|$)/);
            assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${mode} ${path} at ${width}`);
            await expect(page.locator('script, iframe, [onerror], [style]')).toHaveCount(0);
            await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow');
            const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
            assert.deepEqual(axe.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) })), []);
            sweeps++;
            if (mode === 'mixed' && ['/en/', '/es/proyectos/fixture-demostracion/', '/en/projects/fixture-private/'].includes(path)) {
              await page.screenshot({ path: `artifacts/fixture-${path.split('/').filter(Boolean).at(-1)}-${width}.png`, fullPage: true });
            }
          }
        }
        await page.goto('/es/proyectos/fixture-demostracion/');
        await page.locator('.evidence-links a').first().focus();
        assert.equal(await page.locator('a:focus').evaluate(el => getComputedStyle(el).outlineStyle), 'solid');
        await page.keyboard.press('Tab');
        await expect(page.locator('.evidence-links a').last()).toBeFocused();
        for (const link of await page.locator('.evidence-links a').all()) assert((await link.boundingBox()).height >= 44);
      }
      const noJs = await browser.newContext({ javaScriptEnabled: false, baseURL: origin });
      const noJsPage = await noJs.newPage();
      await noJsPage.goto('/es/');
      await noJsPage.locator('a[href="/es/proyectos/fixture-privado/"]').click();
      await noJsPage.getByRole('link', { name: 'English', exact: true }).click();
      await expect(noJsPage).toHaveURL(`${origin}/en/projects/fixture-private/`);
      await noJsPage.locator('.back-link').click();
      await expect(noJsPage).toHaveURL(`${origin}/en/#projects`);
      await noJs.close();
      assert.deepEqual([...new Set(errors)], []);
      console.log(`INFO: ${cspWarnings} occurrences of the existing Astro meta-CSP warning; HTTP script-src remains 'none'.`);
      console.log(`PASS: ${mode}, ES/EN data-only routes, optional fields, metadata, language/history and no-JS navigation.`);
    } finally {
      await context.close();
      await server.stop();
    }
  }
  console.log(`PASS: ${sweeps} responsive/accessibility sweeps, including local screenshots and evidence links.`);
} finally {
  await browser.close();
}
