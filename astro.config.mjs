import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import { securityHeaders } from './security.config.mjs';

export default defineConfig({
  output: 'static',
  trailingSlash: 'always',
  markdown: { syntaxHighlight: false },
  build: { inlineStylesheets: 'never' },
  security: {
    csp: {
      directives: ["default-src 'none'", "img-src 'self'", "font-src 'self'", "base-uri 'none'", "form-action 'none'", "object-src 'none'"],
      scriptDirective: { resources: ["'none'"] },
      styleDirective: { resources: ["'self'"] },
    },
  },
  vite: {
    plugins: [tailwindcss()],
    preview: { headers: securityHeaders },
  },
});
