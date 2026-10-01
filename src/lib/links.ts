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
      ? `mailto:${value}` : undefined;
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
