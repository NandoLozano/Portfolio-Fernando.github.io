# Verificación de las correcciones del portfolio

Fecha: 1 de octubre de 2026. Revisión local sobre `b7d0d58`, que era HEAD y estaba limpio al comenzar. Se leyeron la revisión, instrucciones y decisiones privadas antes de editar; ambos hallazgos seguían presentes. Se conserva `npm start`, el diseño Azul sereno, iconos compactos, las tres muestras y los recursos originales. No se modificaron `.gitignore`, `contexto-codex/`, la CSP, las cabeceras ni los bloqueos de indexación. Sin commit, push ni despliegue.

## Resultados de esta corrección

| Comprobación ejecutada | Resultado |
| --- | --- |
| `npm run check` | 18 archivos; 0 errores, 0 avisos y 0 sugerencias. |
| `npm run build` | 12 páginas estáticas y `_headers`; sin avisos de construcción. |
| `npm run test:security` | 5 pruebas aprobadas. Conservadas las pruebas de rechazo anteriores; añadida recuperación íntegra del destinatario con `#`, `&`, `/`, `=`, `+` y otros caracteres admitidos, sin query ni fragmento. Validadores de repositorio/demo y rutas locales de captura. |
| `npm run test:render-security` | 4 variantes: ES/EN × muestra/real. Título, resumen, categoría, rol, stack, decisiones, resultados, base de medición, alt, pie y metadatos adversarios permanecen como texto. Sin scripts ni manejadores inyectados. URL ejecutable omitida, enlace HTTPS escapado y correo íntegro en el HTML real. |
| `npm test` | 11 pruebas aprobadas en 23,8 s, Edge headless. 40 barridos responsive/axe del sitio normal sin infracciones detectadas. |
| `npm run test:projects` | Tres construcciones aisladas: colección mixta, solo reales y un único real. Comprobación Astro/TypeScript de los fixtures importados desde los datos. 80 barridos responsive/axe adicionales sin infracciones detectadas. |
| Auditoría npm en línea | 0 vulnerabilidades conocidas. Se ejecutó directamente el CLI local de npm; `npm run audit` no pudo resolver el ejecutable `npm` en este PATH. La primera petición al registro falló en el entorno restringido; el reintento autorizado completó la consulta. |
| Inventario de salida | 16 archivos: 12 HTML, CSS, favicon, robots y cabeceras. Sin fixtures, páginas de prueba, referencias a documentos privados, scripts, formularios, iframes ni coincidencias con los patrones de credenciales examinados. |

Se usó Node 24.21.0 y npm local bajo `.tools/`, sin instalar dependencias ni cambiar `package-lock.json`. Los comandos npm se invocaron mediante `node .tools/package/bin/npm-cli.js` con el runtime de Node en PATH. La auditoría utilizó `node .tools/package/bin/npm-cli.js audit --cache .npm-cache`.

## Cobertura de contenido y navegador

- Las muestras actuales mantienen sus textos, stack y rol ilustrativos. Los avisos se derivan de `status`; en colecciones mixtas cada concepto queda identificado individualmente. Los metadatos del inicio y del detalle se comprueban en ambos idiomas, incluida su ausencia de avisos en colecciones solo reales.
- Fixtures sintéticos separados del producto: real con resultado cualitativo sin repositorio, real con demo/repositorio/métrica/captura y real con opcionales vacíos y enlaces rechazados. No representan trabajo de Fernando. Se prueban campos ausentes, cadenas en blanco, listas vacías, captura sin pie, URLs descartadas y secciones sin contenido omitidas.
- Acceso desde iconos, URLs directas, recarga, vuelta al mosaico, idioma equivalente, historial atrás/adelante y enlace al siguiente caso. Un único proyecto no se enlaza a sí mismo como siguiente. Recorrido de inicio, detalle, idioma y regreso con JavaScript desactivado.
- Anchuras 320, 390, 768, 1024 y 1440 px, tablet vertical/horizontal, sin desplazamiento horizontal. Axe con reglas WCAG 2 A/AA, 2.1 AA y 2.2 AA: 120 barridos en total. Enlaces de evidencias con foco visible, orden de teclado y altura mínima de 44 px. La suite normal conserva movimiento reducido y reflujo a 720 px.
- Capturas cargadas desde el propio origen bajo la CSP conservada; texto alternativo localizado, dimensiones, pie opcional y controles externos protegidos. Los enlaces sintéticos a `example.com` se inspeccionan sin abrir destinos externos.
- Inspección visual de inicio ES en escritorio/móvil, inicio EN en tablet, detalle sintético con demo en móvil/tablet horizontal y detalle mínimo EN a 320 px: sin recortes ni solapamientos observados. Artefactos en `artifacts/home-*.png`, `artifacts/case-*.png`, `artifacts/fixture-*.png`; informe normal en `artifacts/browser-results.json`.

Los tests de contenido y escape escriben únicamente en directorios exclusivos `.tools/projects-*` y `.tools/render-security-*`. No generan archivos transitorios en `src/pages/` ni alteran la construcción normal. Las copias se conservan ignoradas para diagnóstico. Solo `dist/` normal es la versión local de entrega.

## Limitaciones observadas

La CSP meta generada por Astro combina `script-src 'none'` con hashes automáticos y Edge avisa de que ignora `'none'` en esa directiva. El aviso ya está en la construcción normal y no procede de los nuevos datos. La cabecera HTTP comprobada contiene exactamente `script-src 'none'`, además de `frame-ancestors 'none'`, y no hay scripts en el HTML. Se mantiene la configuración solicitada; no se afirma que la meta aislada tenga el mismo bloqueo que la cabecera. El test de fixtures registra exclusivamente este aviso conocido y falla ante otros errores de consola o página. Pendiente revisar la generación de la meta en Astro y verificar las cabeceras en el alojamiento elegido.

Pruebas emuladas en Edge, sin Safari/iOS ni dispositivos físicos, lector de pantalla o ampliación real de texto. No equivalen a certificación de accesibilidad. Observación local sin limitar red/CPU: DOMContentLoaded ≈19,9 ms y 10.587 bytes transferidos; no es una medición de producción. La verdad de los resultados y la autorización de capturas requieren revisión editorial; los validadores de enlaces no certifican disponibilidad ni confiabilidad de los sitios de destino.

Siguen pendientes contenido/contactos definitivos, dominio, alojamiento y seguridad pública. Se conserva `noindex`; no se ha publicado nada.

---

# Registro histórico de la primera versión revisable

Fecha: 1 de octubre de 2026. Verificación local sobre la construcción estática; sin publicación. Entorno: Windows, Node 24.21.0, npm 12.2.0, Microsoft Edge con Playwright 1.63.0. Capturas inspeccionadas visualmente después de generar las páginas.

## Resultado

| Comprobación | Resultado |
| --- | --- |
| `npm run check` | 18 archivos, 0 errores, 0 avisos, 0 sugerencias. |
| `npm run build` | 12 páginas estáticas, sin avisos de Astro. |
| `npm test` | 11 pruebas aprobadas en 23,5 segundos. |
| `npm run test:security` | 2 pruebas aprobadas, incluyendo protocolos y destinos adversarios. |
| `npm run test:render-security` | Escape verificado en el navegador para título, texto y metadatos ES/EN. Sin creación de scripts, imágenes ni manejadores de eventos. Construcción de prueba separada; fixtures retiradas. |
| Auditoría npm | 0 vulnerabilidades en 291 paquetes al instalar; comprobación posterior con la caché del mismo registro: 0. |
| Git | Sin cambios en el HTML, fotografías ni vídeo originales. `.gitignore` inicialmente vacío ampliado. Sin commit, push ni cambios remotos. |

La versión inicial de las pruebas usaba `style.zoom`, que no actualiza las media queries como el zoom del navegador. Se corrigió por una emulación del viewport CSS resultante a 200%. Se marcó también la flecha decorativa de la página 404 con `aria-hidden`. El cierre automático de procesos hijos en Windows se sustituyó por la API de preview de Astro dentro del proceso de pruebas; la suite final terminó con código 0.

## Navegación y accesibilidad

- Inicio ES/EN, los seis detalles, páginas de error y enlaces internos responden. Cambio de idioma al mismo proyecto, acceso directo, recarga, regreso al mosaico y atrás/adelante comprobados.
- 40 recorridos de accesibilidad: inicio y tres detalles en ambos idiomas, a 320, 390, 768, 1024 y 1440 px. Axe con reglas WCAG 2 A/AA, 2.1 AA y 2.2 AA: sin incidencias detectadas.
- Sin desbordamientos horizontales en esas anchuras. Tablet emulada a 768×1024 y 1024×768. Reflujo a 720 px como aproximación a una ventana de 1440 px al 200%. No se modificó el zoom persistente del navegador.
- Enlace de salto, orden de foco inicial, foco visible y activación mediante teclado. Altura mínima de 44 px en navegación principal, selector y enlaces de proyecto. Acciones disponibles sin hover.
- Preferencia de movimiento reducido: desplazamiento inmediato y transiciones desactivadas. Navegación de proyecto, idioma y regreso con JavaScript desactivado.
- Metadatos y atributo `lang` revisados para las 12 rutas. Sin scripts, estilos inline, formularios, iframes ni enlaces vacíos en la construcción.

Son pruebas en **Edge headless con emulación**, no pruebas físicas en móvil/iPad ni una certificación de accesibilidad. Queda pendiente comprobar Safari/iOS, dispositivos reales y lectura con lector de pantalla antes de una entrega pública definitiva.

## Rendimiento y recursos

Medición orientativa local, sin limitación de CPU/red y con caché desactivada: `DOMContentLoaded` del inicio ES ≈22,7 ms y 10.447 bytes transferidos (HTML, CSS y recursos solicitados). Cero scripts en el documento y cero recursos externos. Estas cifras no equivalen a rendimiento en una red móvil ni a puntuaciones Lighthouse/Core Web Vitals.

Los archivos de inicio y CSS pesan aproximadamente 11,7 KB y 22,2 KB sin compresión. No se incluyen fotos ni vídeos del portfolio anterior. El favicon es un SVG propio; los iconos de proyecto y el diagrama son vectoriales y no requieren imágenes generadas o descargadas.

## Seguridad y conservación

Se comprobaron CSP y cabeceras en respuestas HTTP reales de la vista previa. Las rutas `.env`, `.git/config`, documentos internos, foto anterior, vídeo anterior y `package.json` respondieron 404. Inventario de `dist/`: 12 HTML, CSS, favicon, robots y `_headers`. Búsqueda de patrones de claves privadas y tokens comunes en fuentes públicas y resultado: sin coincidencias. No es una revisión del historial Git ni de las cuentas externas.

Las únicas diferencias respecto al inventario inicial son la implementación nueva, documentación y ampliación del `.gitignore`. `contexto-codex/PLAN.md` conserva su hash inicial `D8084154588108C2C425A3AFF27EAAD6130D6AADC3439DB2D4BD9C2FD5E067DA`, igual al archivo del IDE. Las referencias originales no se modificaron.

## Capturas locales

- `artifacts/home-desktop.png`
- `artifacts/home-mobile.png`
- `artifacts/home-tablet.png`
- `artifacts/case-desktop.png`
- `artifacts/case-mobile.png`
- Informe automático: `artifacts/browser-results.json`

Los artefactos son locales y están excluidos de Git y de la web.

## Pendiente antes de publicar

Confirmar contactos, presentación, trayectoria, fotografía, proyectos y evidencias; revisar traducciones del contenido definitivo; decidir dominio y alojamiento. Verificar allí HTTPS, cabeceras, errores, permisos y recuperación según `SECURITY.md`. No se ha creado ningún despliegue ni se ha sustituido la publicación anterior.
