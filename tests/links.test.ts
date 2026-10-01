import { test } from 'node:test';
import assert from 'node:assert/strict';
import { safeContactUrl, safeProjectUrl, safeScreenshotSrc } from '../src/lib/links.ts';

test('only confirmed HTTPS profile destinations are accepted', () => {
  assert.equal(safeContactUrl('github', 'https://github.com/example'), 'https://github.com/example');
  assert.equal(safeContactUrl('linkedin', 'https://www.linkedin.com/in/example'), 'https://www.linkedin.com/in/example');
  for (const value of [null, '', 'javascript:alert(1)', 'data:text/html,test', '//github.com/example', 'http://github.com/example', 'https://github.com.evil.test/example', 'https://github.com@evil.test/example', 'https://evil.test@github.com/example', 'https://github.com:444/example', 'https://github.com/example?redirect=evil', 'https://github.com/example#x', 'https://github.com/example/repository', ' https://github.com/example', 'https://github.com/\nexample']) {
    assert.equal(safeContactUrl('github', value), undefined, String(value));
  }
});

test('mailto preserves the full accepted recipient without query or fragment', () => {
  for (const local of ['a#b', 'a&b', 'a/b', 'a=b', 'a+b', "a.!#$&'*+/=^_`{|}~-b", 'a&bcc=recipient']) {
    const recipient = `${local}@example.com`;
    const href = safeContactUrl('email', recipient)!;
    const url = new URL(href);
    assert.equal(url.protocol, 'mailto:');
    assert.equal(url.search, '');
    assert.equal(url.hash, '');
    assert.equal(decodeURIComponent(url.pathname), recipient);
    assert(!/[#&/=]/.test(href.slice('mailto:'.length)));
  }
  assert.equal(safeContactUrl('email', 'a#b@example.com'), 'mailto:a%23b@example.com');
  for (const value of ['a@example.com?subject=x&bcc=b@example.com', 'a%3Fsubject=x@example.com', 'a%250d@example.com', 'a@example.com\n', 'a@example.com,b@example.com']) {
    assert.equal(safeContactUrl('email', value), undefined);
  }
});

test('project destinations require explicit HTTPS without credentials or controls', () => {
  for (const value of ['https://github.com/example/repo', 'https://gitlab.com/group/repo', 'https://demo.example.com/view?mode=demo&lang=en#result']) {
    assert.equal(safeProjectUrl(value), value);
  }
  for (const value of [undefined, '', 'javascript:alert(1)', 'data:text/html,test', '//example.com', 'http://example.com', 'https:example.com', 'https://user:password@example.com', 'https://example.com:444', 'https://example.com\\@evil.test', 'https://example.com/\n', 'https://example.com/%0d%0a', 'https://localhost/', 'https://127.0.0.1/']) {
    assert.equal(safeProjectUrl(value), undefined, String(value));
  }
});

test('screenshots only accept local raster paths in the project asset directory', () => {
  assert.equal(safeScreenshotSrc('/images/projects/case/screen-1.webp'), '/images/projects/case/screen-1.webp');
  for (const value of ['', '//evil.test/screen.png', 'https://example.com/screen.png', 'data:image/png,test', '/images/projects/../secret.png', '/images/projects/%2e%2e/secret.png', '/images/projects/x.svg', '/images/projects/x.png?x=1', '/images/projects/x.png#fragment', '/images/projects/x.png" onerror="alert(1)']) {
    assert.equal(safeScreenshotSrc(value), undefined, value);
  }
});

test('email links reject headers, HTML and executable protocols', () => {
  assert.equal(safeContactUrl('email', 'test@example.com'), 'mailto:test@example.com');
  for (const value of [null, 'javascript:alert(1)', '<script>@example.com', 'test@example.com?bcc=other@example.com', 'test@example.com\r\nBcc:other@example.com', 'test%0d%0a@example.com', 'mailto:test@example.com']) {
    assert.equal(safeContactUrl('email', value), undefined);
  }
});
