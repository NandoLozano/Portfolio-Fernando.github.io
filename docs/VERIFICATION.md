# Registro de la primera versión revisable

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
