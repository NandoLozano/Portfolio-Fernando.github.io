import { writeFile } from 'node:fs/promises';
import { securityHeaders } from '../security.config.mjs';
await writeFile(new URL('../dist/_headers', import.meta.url), `/*\n${Object.entries(securityHeaders).map(([key, value]) => `  ${key}: ${value}`).join('\n')}\n`);
console.log('Static-host headers written. Verify support and responses before deployment.');
