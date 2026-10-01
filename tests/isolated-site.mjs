import { cp, mkdir, mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const source = fileURLToPath(new URL('../', import.meta.url));

// Never create probe pages in src/ or change the normal data/build. All writes
// stay in an exclusively owned, ignored workspace; dependencies resolve upwards.
export async function isolatedSite(label) {
  await mkdir(join(source, '.tools'), { recursive: true });
  const root = await mkdtemp(join(source, '.tools', `${label}-`));
  for (const name of ['src', 'public', 'astro.config.mjs', 'security.config.mjs', 'tsconfig.json', 'package.json']) {
    await cp(join(source, name), join(root, name), { recursive: true });
  }
  return {
    root,
    config: { root, logLevel: 'silent', vite: { cacheDir: join(root, '.vite') } },
    read: path => readFile(resolve(root, path), 'utf8'),
    async write(path, content) {
      const dest = resolve(root, path);
      await mkdir(resolve(dest, '..'), { recursive: true });
      await writeFile(dest, content);
    },
  };
}
