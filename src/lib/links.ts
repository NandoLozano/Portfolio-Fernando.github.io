export type ContactKind = 'github' | 'linkedin' | 'email';
// No inferred accounts or sample addresses. Add only confirmed values.
export const contacts: Record<ContactKind, string | null> = {
  github: null,
  linkedin: null,
  email: null,
};

export function safeContactUrl(kind: ContactKind, value: string | null): string | undefined {
  if (!value || value.trim() !== value || /[\s\u0000-\u001f\u007f]/u.test(value)) return;
  if (kind === 'email') {
    return /^[A-Z0-9.!#$&'*+/=^_`{|}~-]+@[A-Z0-9](?:[A-Z0-9.-]*[A-Z0-9])?\.[A-Z]{2,}$/i.test(value)
      // Encode the recipient once, preserving its @ separator (RFC 6068 §2).
      ? `mailto:${value.split('@').map(part => encodeURIComponent(part)).join('@')}` : undefined;
  }
  try {
    const url = new URL(value);
    const hosts = kind === 'github' ? ['github.com', 'www.github.com'] : ['linkedin.com', 'www.linkedin.com'];
    if (url.protocol !== 'https:' || !hosts.includes(url.hostname) || url.username || url.password || url.port || url.search || url.hash) return;
    if (kind === 'github' && !/^\/[A-Za-z0-9-]+\/?$/.test(url.pathname)) return;
    if (kind === 'linkedin' && !/^\/in\/[A-Za-z0-9_-]+\/?$/.test(url.pathname)) return;
    return url.href;
  } catch { return; }
}

// Project links are ordinary HTTPS destinations, never embeds or executable URLs.
export function safeProjectUrl(value?: string): string | undefined {
  if (!value || /[\s\u0000-\u001f\u007f\\]/u.test(value) || /%(?:0[0-9a-f]|1[0-9a-f]|7f)/i.test(value)) return;
  try {
    const url = new URL(value);
    if (!value.startsWith('https://') || url.protocol !== 'https:' || url.username || url.password || url.port) return;
    if (!/^(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}$/i.test(url.hostname)) return;
    return url.href;
  } catch { return; }
}

// Local raster assets only: compatible with img-src 'self', no traversal or queries.
export function safeScreenshotSrc(value: string): string | undefined {
  return /^\/images\/projects\/(?:[a-zA-Z0-9_-]+\/)*[a-zA-Z0-9_-]+\.(?:png|jpe?g|webp|avif)$/.test(value) ? value : undefined;
}
