import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mkdir } from 'node:fs/promises';

const pairs = [
  ['/es/proyectos/automatizacion/', '/en/projects/automation/'],
  ['/es/proyectos/producto-web/', '/en/projects/web-product/'],
  ['/es/proyectos/backend/', '/en/projects/backend/'],
];
const routes = ['/', '/es/', '/en/', ...pairs.flat(), '/es/404/', '/en/404/', '/404.html'];

test('built pages, metadata, resource policy and local links', async ({ page, request }) => {
  for (const path of routes) {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    expect(response?.headers()['content-security-policy']).toContain("frame-ancestors 'none'");
    expect(response?.headers()['content-security-policy']).not.toMatch(/unsafe-inline|unsafe-eval/);
    expect(response?.headers()['x-content-type-options']).toBe('nosniff');
    expect(response?.headers()['permissions-policy']).toContain('camera=()');
    await expect(page.locator('html')).toHaveAttribute('lang', path.startsWith('/en/') ? 'en' : 'es');
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /.+/);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow');
    expect(await page.locator('script, iframe, form, [style], a[href="#"]').count()).toBe(0);
    const hrefs = await page.locator('a').evaluateAll(nodes => nodes.map(a => a.getAttribute('href')!));
    for (const href of [...new Set(hrefs)]) {
      if (href.startsWith('#')) { await expect(page.locator(href)).toHaveCount(1); continue; }
      if (href.startsWith('/')) {
        const [route, fragment] = href.split('#');
        const linked = await request.get(route!);
        expect(linked.status(), href).toBe(200);
        if (fragment) expect(await linked.text()).toContain(`id="${fragment}"`);
      }
    }
    const external = await page.evaluate(() => performance.getEntriesByType('resource').map(entry => entry.name).filter(url => !url.startsWith(location.origin)));
    expect(external).toEqual([]);
    expect(errors).toEqual([]);
  }
});

test('language equivalents, direct links, return and browser history', async ({ page }) => {
  for (const [es, en] of pairs) {
    await page.goto('/es/');
    await page.locator(`.project-link[href="${es}"]`).click();
    await expect(page).toHaveURL(new RegExp(es!));
    await page.getByRole('link', { name: 'English', exact: true }).click();
    await expect(page).toHaveURL(new RegExp(en!));
    await page.reload();
    await expect(page.locator('h1')).toBeVisible();
    await page.getByRole('link', { name: 'Español', exact: true }).click();
    await expect(page).toHaveURL(new RegExp(es!));
    await page.getByRole('link', { name: 'Volver a proyectos', exact: true }).click();
    await expect(page).toHaveURL(/\/es\/#projects$/);
    await page.goBack();
    await expect(page).toHaveURL(new RegExp(es!));
    await page.goForward();
    await expect(page).toHaveURL(/\/es\/#projects$/);
  }
});

for (const width of [320, 390, 768, 1024, 1440]) {
  test(`responsive layout and accessibility at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: width === 1024 ? 768 : 1024 });
    for (const path of ['/es/', '/en/', ...pairs.flat()]) {
      await page.goto(path);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), path).toBe(true);
      const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
      expect(results.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) })), path).toEqual([]);
    }
  });
}

test('keyboard, touch targets, reduced motion and text zoom', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/es/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Saltar al contenido' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Explorar proyectos' })).toBeFocused();
  expect(await page.locator('a:focus').evaluate(el => getComputedStyle(el).outlineStyle)).toBe('solid');
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#projects$/);
  for (const link of await page.locator('.project-link, .main-nav a:visible, .language-switch a').all()) {
    const box = await link.boundingBox();
    expect(box!.height).toBeGreaterThanOrEqual(44);
  }
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe('auto');
  expect(await page.locator('.app-icon').first().evaluate(el => getComputedStyle(el).transitionDuration)).toBe('0s');
  // Emulate the 720 CSS-pixel viewport produced by 200% browser zoom on 1440px.
  // CSS zoom does not update media queries and is not equivalent to browser zoom.
  await page.setViewportSize({ width: 720, height: 500 });
  for (const path of ['/es/', '/en/', ...pairs.flat()]) {
    await page.goto(path);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});

test('all essential navigation works with JavaScript disabled', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4321/en/');
  await page.locator('.project-link').first().click();
  await expect(page.locator('h1')).toHaveText('Automation');
  await page.getByRole('link', { name: 'Español', exact: true }).click();
  await expect(page.locator('h1')).toHaveText('Automatización');
  await page.getByRole('link', { name: 'Volver a proyectos', exact: true }).click();
  await expect(page).toHaveURL(/\/es\/#projects$/);
  await context.close();
});

test('review screenshots and browser performance observations', async ({ page }) => {
  await mkdir('artifacts', { recursive: true });
  for (const [name, path, width, height] of [
    ['home-desktop', '/es/', 1440, 1050], ['home-mobile', '/es/', 390, 844],
    ['home-tablet', '/en/', 768, 1024], ['case-desktop', pairs[0]![0], 1440, 1050],
    ['case-mobile', pairs[1]![1], 390, 844],
  ] as const) {
    await page.setViewportSize({ width, height });
    await page.goto(path);
    await page.screenshot({ path: `artifacts/${name}.png`, fullPage: true });
  }
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Network.enable');
  await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
  await page.goto('/es/');
  console.log('Local performance (no throttling):', await page.evaluate(() => {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    return { domContentLoadedMs: navigation.domContentLoadedEventEnd, transferredBytes: navigation.transferSize + performance.getEntriesByType('resource').reduce((sum, entry) => sum + (entry as PerformanceResourceTiming).transferSize, 0), scripts: document.scripts.length };
  }));
});

test('unknown paths return a usable 404 and private resources stay unavailable', async ({ page, request }) => {
  const response = await page.goto('/en/does-not-exist/');
  expect(response?.status()).toBe(404);
  await expect(page.getByRole('link', { name: 'Back to home', exact: true })).toBeVisible();
  for (const path of ['/.env', '/.git/config', '/contexto-codex/PLAN.md', '/img/Foto%20Fernando.jpg', '/sample_960x400_ocean_with_audio.mp4', '/package.json']) {
    expect((await request.get(path)).status(), path).toBe(404);
  }
});
