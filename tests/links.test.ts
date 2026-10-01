import { test } from 'node:test';
import assert from 'node:assert/strict';
import { safeContactUrl } from '../src/lib/links.ts';

test('only confirmed HTTPS profile destinations are accepted', () => {
  assert.equal(safeContactUrl('github', 'https://github.com/example'), 'https://github.com/example');
  assert.equal(safeContactUrl('linkedin', 'https://www.linkedin.com/in/example'), 'https://www.linkedin.com/in/example');
  for (const value of [null, '', 'javascript:alert(1)', 'data:text/html,test', '//github.com/example', 'http://github.com/example', 'https://github.com.evil.test/example', 'https://github.com@evil.test/example', 'https://evil.test@github.com/example', 'https://github.com:444/example', 'https://github.com/example?redirect=evil', 'https://github.com/example#x', 'https://github.com/example/repository', ' https://github.com/example', 'https://github.com/\nexample']) {
    assert.equal(safeContactUrl('github', value), undefined, String(value));
  }
});

test('email links reject headers, HTML and executable protocols', () => {
  assert.equal(safeContactUrl('email', 'test@example.com'), 'mailto:test@example.com');
  for (const value of [null, 'javascript:alert(1)', '<script>@example.com', 'test@example.com?bcc=other@example.com', 'test@example.com\r\nBcc:other@example.com', 'test%0d%0a@example.com', 'mailto:test@example.com']) {
    assert.equal(safeContactUrl('email', value), undefined);
  }
});
