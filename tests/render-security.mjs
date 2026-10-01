import { readFile, writeFile, unlink } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { chromium } from '@playwright/test';
process.env.ASTRO_TELEMETRY_DISABLED = '1';
const { build } = await import('astro');
const payload = '</title><script>globalThis.__portfolioProbe = 1</script><img src=x onerror="globalThis.__portfolioProbe = 1">';
const created = [];
let browser;
try {
  for (const lang of ['es', 'en']) {
    const path = new URL(`../src/pages/security-probe-${lang}.astro`, import.meta.url);
    await writeFile(path, `---
import ProjectDetail from '../components/ProjectDetail.astro';
import { projects } from '../data/projects';
const project = structuredClone(projects[0]);
project.content.${lang}.title = ${JSON.stringify(payload)};
project.content.${lang}.summary = ${JSON.stringify(payload)};
---
<ProjectDetail lang="${lang}" project={project} />
`, { flag: 'wx' });
    created.push(path);
  }
  await build({ outDir: './.tools/security-dist/', logLevel: 'silent' });
  browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL || 'msedge' });
  const page = await browser.newPage();
  await page.route('**/*', route => route.abort());
  for (const lang of ['es', 'en']) {
    const html = await readFile(new URL(`../.tools/security-dist/security-probe-${lang}/index.html`, import.meta.url), 'utf8');
    // Parse as a browser: angle brackets inside a quoted attribute are safe text.
    await page.setContent(html);
    assert.equal(await page.locator('script, img, [onerror], [onfocus]').count(), 0, 'Content must not create executable elements or attributes');
    assert.equal(await page.locator('h1').textContent(), payload);
    assert((await page.locator('meta[name="description"]').getAttribute('content')).startsWith(payload));
    assert.equal(await page.evaluate(() => globalThis.__portfolioProbe), undefined);
    assert(html.includes('&lt;script&gt;'), 'Probe must remain escaped visible text');
    assert(html.includes('&quot;'), 'Attribute quotes must be escaped');
  }
  console.log('PASS: controlled markup is escaped in both languages, including metadata.');
} finally {
  await browser?.close();
  // Only files created with exclusive ownership above are removed.
  for (const path of created) await unlink(path);
}
