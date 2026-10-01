# Portfolio de Fernando — primera versión revisable

Portfolio estático bilingüe con Astro 7, TypeScript 6 y Tailwind CSS 4. Dirección visual **Azul sereno**, a partir de `contexto-codex/AGENTS.md`, `contexto-codex/PLAN.md`, `contexto-codex/docs/DESIGN.md` y sus tres referencias. Esta entrega es local y no está publicada.

## Vista previa

- Español: <http://127.0.0.1:4321/es/>
- English: <http://127.0.0.1:4321/en/>
- Ejemplo de detalle: <http://127.0.0.1:4321/es/proyectos/automatizacion/>

Necesitas Node.js 22.12 o superior (probado con 24.21) y npm. Desde la raíz:

```sh
npm ci
npm run check
npm run build
npm run preview
```

El servidor escucha solo en `127.0.0.1`. Para detenerlo, `Ctrl+C`. La vista previa sirve exclusivamente `dist/`.

En este equipo Node no estaba en PATH. Se utilizó el runtime de Node incluido en Codex y npm local en `.tools/` (ambos fuera de Git). Con las dependencias ya instaladas también puedes ejecutar desde PowerShell:

```powershell
.\scripts\preview.ps1
```

El script busca Node en PATH o en el runtime local de Codex, construye el proyecto y arranca la vista previa. No instala software ni cambia políticas de ejecución. Si PowerShell impide ejecutar scripts, utiliza los comandos npm con una instalación normal de Node.

## Comandos

| Comando | Función |
| --- | --- |
| `npm run dev` | Desarrollo con recarga; no sirve para comprobar la CSP de producción. |
| `npm run check` | Diagnósticos de Astro y TypeScript. |
| `npm run build` | Genera las páginas y el archivo opcional de cabeceras `dist/_headers`. |
| `npm run preview` | Sirve la construcción en el puerto 4321 con cabeceras de seguridad. |
| `npm test` | Navegación, metadatos, responsive, axe, teclado, capturas y respuestas HTTP en Edge headless. |
| `npm run test:security` | Valida destinos y rechaza protocolos, dominios y cabeceras de correo no permitidos. |
| `npm run test:render-security` | Prueba controlada de escape en los componentes reales, en una construcción aislada. |
| `npm run audit` | Auditoría actual de dependencias directas y transitivas. |

Las pruebas de navegador usan Edge instalado. Para Chromium: `npx playwright install chromium` y `PLAYWRIGHT_CHANNEL=chromium npm test` (en PowerShell: `$env:PLAYWRIGHT_CHANNEL='chromium'; npm test`). El servidor de prueba arranca y se detiene dentro del proceso; reutiliza una vista previa local si ya está activa. Las capturas y el informe se guardan en `artifacts/`, ignorado por Git.

## Contenido y estructura

| Archivo | Qué editar |
| --- | --- |
| `src/data/projects.ts` | Proyectos tipados: identidad, icono, color, stack y contenido ES/EN. |
| `src/lib/i18n.ts` | Textos de interfaz, inicio, accesibilidad, metadatos y rutas de idiomas. |
| `src/lib/links.ts` | LinkedIn, GitHub y correo; actualmente `null` hasta confirmar valores. |
| `src/styles/global.css` | Paleta, tipografía, composición y adaptación a pantallas. |
| `src/components/` | Cabecera, iconos, mosaico, contacto, inicio y caso reutilizable. |
| `security.config.mjs` | Cabeceras compartidas entre vista previa y salida para alojamiento estático. |

Para añadir otro caso, incorpora un objeto `Project` en el array: `id` único, un icono admitido, tono y ambos idiomas con `slug` propio. Las rutas se generan automáticamente y el selector mantiene el proyecto equivalente. No hay un máximo de tres casos. Los nombres pueden ocupar varias líneas.

Los tres casos actuales son **conceptos de muestra**, incluido el stack y el rol. No se afirman métricas, experiencia ni resultados reales. El texto «Sobre mí» está marcado como provisional; la trayectoria no se ha reutilizado sin validación. Para introducir casos reales hay que ampliar el tipo `sample`, revisar avisos y estados en los componentes y aportar evidencias verificadas; no basta con ocultar las etiquetas.

Los contactos solo se convierten en enlaces cuando se facilitan valores válidos: URL HTTPS de perfil de GitHub/LinkedIn y correo sin `mailto:` ni parámetros. Las acciones ausentes no son botones falsos. Las fuentes son del sistema y los iconos son SVG propios; no se solicita ningún recurso externo.

### Rutas

- `/` y `/es/`: inicio en español; `/en/`: inglés.
- `/es/proyectos/{slug}/` y `/en/projects/{slug}/`: casos equivalentes.
- `/es/404/`, `/en/404/`: errores localizados; `/404.html`: alternativa bilingüe para alojamientos estáticos.

## Conservación del portfolio original

`index.html`, `img/` y el vídeo original se conservan sin modificaciones. No se copian a `public/` ni a `dist/`. El `.gitignore` local estaba vacío y se ha ampliado; los documentos y las referencias de `contexto-codex/` se mantienen. El plan abierto en el IDE y su copia local tenían el mismo SHA-256 al comenzar.

La fotografía, el logo, los datos profesionales y las direcciones del HTML antiguo quedan fuera de la nueva web hasta revisión. El inventario y las limitaciones están en `docs/VERIFICATION.md` y `docs/SECURITY.md`.

## Antes de publicar

La publicación requiere la indicación de Fernando. Publicar **solo `dist/`**: servir la raíz del repositorio expondría el portfolio antiguo y documentos que no pertenecen al sitio. No se ha configurado ningún despliegue ni modificado GitHub Pages.

Falta confirmar contactos, fotografía, trayectoria, casos y evidencias, dominio y alojamiento. Después se podrá configurar `site`, canonical y URLs públicas de idiomas, y retirar conjuntamente `noindex` de la plantilla, `X-Robots-Tag` y el bloqueo de `robots.txt`.

La configuración usa rutas desde la raíz. Un despliegue bajo un subdirectorio de GitHub Pages requiere adaptar `base`, las rutas y los recursos, y volver a probarlos. GitHub Pages no aplica `_headers`; debe elegirse y verificarse un alojamiento que permita las cabeceras necesarias. Más detalles en `docs/SECURITY.md`.
