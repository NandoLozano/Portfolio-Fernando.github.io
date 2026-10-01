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
| `npm start` | Acceso directo a `npm run dev`, con recarga automática al editar. |
| `npm run dev` | Desarrollo con recarga; no sirve para comprobar la CSP de producción. |
| `npm run check` | Diagnósticos de Astro y TypeScript. |
| `npm run build` | Genera las páginas y el archivo opcional de cabeceras `dist/_headers`. |
| `npm run preview` | Sirve la construcción en el puerto 4321 con cabeceras de seguridad. |
| `npm test` | Navegación, metadatos, responsive, axe, teclado, capturas y respuestas HTTP en Edge headless. |
| `npm run test:security` | Valida contactos, enlaces de proyectos, capturas y codificación íntegra del destinatario de correo. |
| `npm run test:render-security` | Escape de texto, resultados, capturas, metadatos y correo en componentes ES/EN de muestra y reales, en una copia aislada. |
| `npm run test:projects` | Fixtures tipados: muestras + reales, solo reales y un único proyecto; rutas, opcionales, metadatos, teclado, capturas, accesibilidad y navegación sin JS. |
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

### Añadir proyectos únicamente mediante datos

Añade un objeto `Project` al array de `src/data/projects.ts`; no hay que editar componentes, rutas ni traducciones de interfaz. El orden del array determina el mosaico y el siguiente caso. No hay un máximo de tres; si solo hay uno, se omite «Siguiente caso».

1. Asigna un `id` único, `icon` (`workflow`, `window` o `database`), `tone` (`blue`, `lavender` o `sand`) y `status`: `sample` para conceptos o `real` para trabajo realizado y confirmado.
2. Completa `content.es` y `content.en`, cada uno con `slug`, `title` y `summary`. Usa slugs únicos por idioma, con letras minúsculas ASCII, números y guiones, sin barras ni parámetros. El mismo objeto relaciona las traducciones aunque sus slugs sean distintos.
3. Añade solo los campos que tengan contenido confirmado, según la tabla. Para omitirlos, elimina la propiedad; también se omiten cadenas en blanco y listas vacías. No hace falta un repositorio público ni una métrica para mostrar un caso real.
4. Si hay capturas, coloca los archivos autorizados en `public/images/projects/` y referencia sus rutas desde los datos. No hace falta modificar la CSP ni los componentes.
5. Ejecuta `npm run check`, `npm run build`, `npm run test:security`, `npm run test:render-security`, `npm run test:projects` y `npm test`. Revisa las traducciones, las nuevas rutas y los destinos externos reales antes de publicar.

| Campo opcional | Datos y comportamiento |
| --- | --- |
| `stack` | Lista compartida de tecnologías. Etiquetas ilustrativas solo en muestras. |
| `repository`, `demo` | URL HTTPS completa compartida. Se rechazan protocolos alternativos, credenciales, controles, puertos no estándar y hosts sin dominio. Se permiten rutas, query y fragmento; no se incrustan servicios externos. Un enlace rechazado se omite. |
| `content.{idioma}.category`, `role`, `problem`, `solution` | Texto plano localizado; sección o etiqueta ausente si está vacío. |
| `flow` | Lista de pasos en texto plano; leyenda conceptual solo para muestras. |
| `decisions` | Lista de objetos `{ title, text }`. |
| `validation` | Lista de comprobaciones pendientes, bajo «Qué habría que validar»; no son resultados alcanzados. |
| `results` | Resultados cualitativos `{ kind: 'qualitative', text }` o métricas `{ kind: 'metric', value, text, basis, confirmed: true }`. `basis` explica la fuente, el período o método de medición. No se muestra una métrica sin confirmación, valor, explicación y base. La veracidad requiere revisión editorial. |
| `screenshots` | Lista localizada de `{ src, alt, width, height, caption? }`. `alt` traducido no vacío, dimensiones enteras positivas y pie opcional. Rutas locales `/images/projects/...` con nombres alfanuméricos, guiones o guiones bajos y extensión `png`, `jpg`, `jpeg`, `webp` o `avif`; sin URLs remotas, SVG, query ni recorridos `..`. |

Los resultados, pies y textos alternativos se escapan como texto, igual que el resto del contenido. Si no hay enlaces válidos ni capturas válidas, desaparece «Evidencias y enlaces». Los archivos de captura deben existir y sus dimensiones deben corresponder al recurso; revisa también sus metadatos y permisos de publicación.

Los avisos del inicio y sus metadatos indican muestras solo si existe algún proyecto `sample`; en una colección mixta cada icono de muestra lleva su propia etiqueta. Los casos `real` usan etiquetas de contribución y tecnologías, sin avisos ni metadatos de concepto. `noindex` permanece incluso si todos los proyectos son reales.

Los tres casos actuales siguen siendo **conceptos de muestra**, incluido el stack y el rol. No se han incorporado proyectos profesionales, contactos ni métricas inventadas. «Sobre mí» continúa marcado como provisional y la trayectoria pendiente de validación.

Los ejemplos ejecutables de casos reales están exclusivamente en `tests/fixtures/projects.ts`: un caso cualitativo sin repositorio, otro con demo/repositorio/captura/métrica sintética y otro sin campos opcionales. `test:projects` importa esos datos solo en copias temporales bajo `.tools/`; comprueba también sus tipos. No altera `src/`, `public/` ni `dist/` normales. `test:render-security` usa el mismo aislamiento. Esas copias y las capturas de `artifacts/` están ignoradas y quedan disponibles para diagnóstico; no deben publicarse.

Los contactos solo se convierten en enlaces cuando se facilitan valores válidos: URL HTTPS de perfil de GitHub/LinkedIn y correo sin `mailto:` ni parámetros. Las acciones ausentes no son botones falsos. Las fuentes son del sistema y los iconos son SVG propios; no se solicita ningún recurso externo.

El correo se valida antes de codificar cada parte, conservando el separador `@`. Así se mantienen íntegros caracteres admitidos como `#`, `&`, `/`, `=` y `+`, sin convertirlos en fragmentos ni cabeceras. Se siguen rechazando porcentajes pre-codificados, parámetros y saltos de línea. Véase [RFC 6068, sección 2](https://www.rfc-editor.org/rfc/rfc6068.html#section-2).

## Verificación local de esta revisión

1 de octubre de 2026: tipos sin errores/avisos; construcción normal de 12 páginas; 5 pruebas de enlaces; escape ES/EN en muestras y reales; 11 pruebas de navegador aprobadas. Los fixtures pasan las tres colecciones y 80 barridos responsive/axe, además de los 40 del sitio normal, entre 320 y 1440 px. Auditoría en línea de npm: 0 vulnerabilidades conocidas. Resultados, capturas y alcance en [docs/VERIFICATION.md](docs/VERIFICATION.md).

Limitaciones: emulación en Edge, sin dispositivos físicos ni Safari/iOS; no acredita zoom real de texto ni una certificación de accesibilidad. Astro genera un aviso previo en la CSP meta al combinar `'none'` con hashes; la cabecera HTTP conserva `script-src 'none'`, comprobado localmente. La configuración de seguridad no se ha cambiado: véase [docs/SECURITY.md](docs/SECURITY.md). Los destinos sintéticos externos no se visitan; la disponibilidad de repositorios/demos definitivos y las cabeceras públicas siguen pendientes.

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
