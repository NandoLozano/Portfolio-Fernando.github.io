// Own the preview in-process so Windows child-process cleanup is unnecessary.
export default async function setup() {
  process.env.ASTRO_TELEMETRY_DISABLED = '1';
  try {
    const response = await fetch('http://127.0.0.1:4321/es/');
    if (response.ok && (await response.text()).includes('Fernando')) return;
  } catch { /* No existing preview. */ }
  const { preview } = await import('astro');
  const server = await preview({ server: { host: '127.0.0.1', port: 4321 } });
  return () => server.stop();
}
