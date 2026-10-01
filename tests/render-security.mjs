import assert from 'node:assert/strict';
import { chromium } from '@playwright/test';
import { isolatedSite } from './isolated-site.mjs';
process.env.ASTRO_TELEMETRY_DISABLED = '1';
const { build } = await import('astro');
const payload = '</title><script>globalThis.__portfolioProbe = 1</script><img src=x onerror="globalThis.__portfolioProbe = 1">';
const email = "a.!#$&'*+/=^_`{|}~-b@example.com";
const site = await isolatedSite('render-security');
let browser;
try {
  const links = await site.read('src/lib/links.ts');
  await site.write('src/lib/links.ts', links.replace('email: null', () => `email: ${JSON.stringify(email)}`));
  for (const lang of ['es', 'en']) {
    for (const status of ['sample', 'real']) {
      await site.write(`src/pages/security-probe-${lang}-${status}.astro`, `---
import ProjectDetail from '../components/ProjectDetail.astro';
import { projects } from '../data/projects';
const project = structuredClone(projects[0]!);
const payload = ${JSON.stringify(payload)};
project.status = '${status}';
project.stack = [payload];
project.repository = 'javascript:alert(1)';
project.demo = 'https://example.com/demo?x=one&y=two';
project.content.${lang} = {
  slug: project.content.${lang}.slug,
  title: payload, summary: payload, category: payload,
  role: payload, problem: payload, solution: payload,
  decisions: [{ title: payload, text: payload }], flow: [payload], validation: [payload],
  results: [
    { kind: 'qualitative', text: payload },
    { kind: 'metric', value: payload, text: payload, basis: payload, confirmed: true },
    { kind: 'metric', value: 'UNCONFIRMED', text: payload, basis: '', confirmed: true },
    // Intentionally bypass the type contract to exercise the rendering guard.
    { kind: 'metric', value: 'UNCONFIRMED', text: payload, basis: payload, confirmed: false as unknown as true },
  ],
  screenshots: [
    { src: '/images/projects/fixture.png', alt: payload, caption: payload, width: 960, height: 540 },
    { src: 'javascript:alert(1)', alt: payload, width: 960, height: 540 },
    { src: '//evil.test/x.png', alt: payload, width: 960, height: 540 },
    { src: '/images/projects/blank-alt.png', alt: ' ', width: 960, height: 540 },
    { src: '/images/projects/no-size.png', alt: payload, width: 0, height: 540 },
  ],
};
---
<ProjectDetail lang="${lang}" project={project} />
`);
    }
  }
  await build(site.config);
  browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL || 'msedge' });
  const page = await browser.newPage();
  await page.route('**/*', route => route.abort());
  for (const lang of ['es', 'en']) {
    for (const status of ['sample', 'real']) {
      const html = await site.read(`dist/security-probe-${lang}-${status}/index.html`);
      // Parse the actual Astro output: strings must remain text and attributes.
      await page.setContent(html);
      assert.equal(await page.locator('script, [onerror], [onfocus], iframe').count(), 0);
      assert.equal(await page.locator('img').count(), 1);
      assert.equal(await page.locator('img').getAttribute('src'), '/images/projects/fixture.png');
      assert.equal(await page.locator('img').getAttribute('alt'), payload);
      assert.equal(await page.locator('.project-screenshot figcaption').textContent(), payload);
      assert.equal(await page.locator('h1').textContent(), payload);
      assert.equal(await page.locator('.case-summary').textContent(), payload);
      assert.equal(await page.locator('.result-value').textContent(), payload);
      assert.equal(await page.locator('.actual-results li').count(), 2);
      assert.equal(await page.locator('.actual-results li p').textContent(), payload);
      assert.equal(await page.locator('.decision h3').textContent(), payload);
      assert.equal(await page.locator('.tech-tag').textContent(), payload);
      for (const selector of ['meta[name="description"]', 'meta[property="og:description"]', 'meta[property="og:title"]']) {
        assert((await page.locator(selector).getAttribute('content')).startsWith(payload));
      }
      assert.equal(await page.locator('.evidence-links a').count(), 1);
      assert.equal(await page.locator('.evidence-links a').getAttribute('href'), 'https://example.com/demo?x=one&y=two');
      const emailHref = await page.locator('a[href^="mailto:"]').first().getAttribute('href');
      const mailto = new URL(emailHref);
      assert.equal(decodeURIComponent(mailto.pathname), email);
      assert.equal(mailto.search, '');
      assert.equal(mailto.hash, '');
      assert.equal(await page.evaluate(() => globalThis.__portfolioProbe), undefined);
      assert(html.includes('&lt;script&gt;'));
      assert(html.includes('&quot;'));
    }
  }
  console.log('PASS: ES/EN × sample/real, content, results, captions, alt text, metadata, rejected URLs and complete mailto recipients remain escaped.');
} finally {
  await browser?.close();
}
