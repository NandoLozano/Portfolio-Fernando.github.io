# Integración continua y futuro despliegue

Esta configuración comprueba el portfolio en GitHub Actions. No publica el sitio, no utiliza credenciales de alojamiento y no modifica los ajustes del repositorio en GitHub.

## Automatizaciones incluidas

| Automatización | Cuándo se ejecuta | Qué aporta |
| --- | --- | --- |
| Portfolio CI | Pull requests dirigidas a `main`, pushes a `main` y ejecución manual | Tipos, construcción, enlaces seguros, escape de plantillas, navegación, responsive, accesibilidad y casos reales mediante fixtures aisladas. |
| Auditoría de dependencias | Lunes a las 07:17 UTC y ejecución manual | Detectar avisos nuevos aunque no cambie el código. |
| Dependabot | Semanalmente | Proponer actualizaciones de npm y de las acciones mediante pull requests, sin fusionarlas automáticamente. |
| Artefactos de CI | Al ejecutar las pruebas; la construcción solo tras éxito | Descargar capturas, informes y la salida estática comprobada durante siete días. No son una web publicada. |

Los checks de CI tienen nombres estables: `Build and security` y `Browser and accessibility`. El segundo depende del primero. Ambos deben ser obligatorios para integrar cambios a la rama protegida; tener un YAML por sí solo no impide hacer merge ni push.

La auditoría incluye herramientas de desarrollo y transitivas. Un aviso alto/crítico, o un fallo al consultar la auditoría, hace fallar el job; los avisos inferiores se muestran en los registros y también requieren valoración. Esto no acredita ausencia de vulnerabilidades.

La CI instala desde `package-lock.json` mediante `npm ci --ignore-scripts`. Evita los scripts automáticos de instalación de dependencias. Las pruebas y la construcción siguen ejecutando código del proyecto y sus herramientas; no debe tratarse como una sandbox para código arbitrario. Si una futura dependencia necesita un script de instalación, revisar el caso y comprobar la solución antes de habilitarlo.

El job de navegador instala Chromium de la versión de Playwright fijada en el proyecto. `PLAYWRIGHT_CHANNEL=chromium` funciona en las pruebas normales y las de contenido aislado; las pruebas locales conservan Edge como valor por defecto. Las pruebas normales se ejecutan con un trabajador y prohíben `test.only`. No se han introducido dependencias nuevas ni modificado la configuración local de navegador.

## Protección de los workflows

- `GITHUB_TOKEN` limitado a `contents: read`; sin secretos de despliegue ni permisos para modificar código, publicar o aprobar pull requests.
- Acciones oficiales de GitHub fijadas a un SHA completo, comprobado contra las etiquetas de su repositorio de origen. Dependabot propone la actualización de estas revisiones.
- Checkout sin conservar credenciales. Runners hospedados y efímeros, sin ejecutar contribuciones externas en un ordenador personal.
- Evento `pull_request`, sin `pull_request_target` ni encadenamiento privilegiado mediante `workflow_run`.
- Límites de duración y cancelación de comprobaciones obsoletas de la misma rama/pull request.
- Caché de descargas npm; no se comparte una instalación de `node_modules` ni se reutilizan artefactos de una pull request para desplegar.
- Artefactos con rutas específicas y caducidad de siete días: únicamente `dist/`, capturas/informes de prueba y trazas. No se sube la raíz del repositorio. Los artefactos de un repositorio público no deben contener información privada.

La fijación por SHA protege frente a cambios posteriores de una etiqueta; no sustituye la revisión de las actualizaciones. El job verifica contenido controlado por Git, que puede ser alterado por una pull request: conservar revisión humana y protección de ramas.

## Activación en GitHub

1. Revisar e incorporar los archivos `.github/workflows/ci.yml`, `.github/workflows/dependency-audit.yml`, `.github/dependabot.yml` y esta guía. Incluir también las correcciones actuales del portfolio y sus nuevos archivos de prueba: la CI utiliza `test:projects`.
2. Subir los cambios y comprobar la primera ejecución real en la pestaña Actions. La validación local no sustituye comprobar los runners Linux de GitHub.
3. Crear una regla para `main` que exija pull request y los dos checks anteriores; bloquear borrado y force push. Si trabajas solo, no exijas una aprobación propia imposible de conceder. Valorar aplicar la regla a administradores y limitar bypass según tu flujo de trabajo.
4. En Actions, usar permisos predeterminados de lectura y mantener desactivada la opción que permite crear/aprobar pull requests. Revisar la política de acciones permitidas; esta configuración utiliza acciones oficiales.
5. Revisar las opciones de aprobación de ejecuciones de colaboradores externos, notificaciones y límites de gasto/minutos del plan.
6. Activar alertas y actualizaciones de seguridad de Dependabot y, si está disponible en el repositorio, detección de secretos con protección de pushes. Esas opciones se configuran en GitHub y no quedan activadas simplemente por añadir `dependabot.yml`.

No se han creado commits, hecho push, activado reglas remotas ni ejecutado un workflow en GitHub como parte de la preparación local.

## Qué añadir después

| Función | Utilidad y momento adecuado |
| --- | --- |
| CodeQL | Análisis estático de JS/TS y workflows. Valorar después de estabilizar la CI; su cobertura no sustituye las pruebas de plantillas Astro ni de configuración del alojamiento. |
| Presupuesto de rendimiento | Detectar aumentos de peso/carga con mediciones repetibles y límites basados en una referencia real. |
| Enlaces externos | Comprobar periódicamente demos, repositorios y contactos cuando existan valores confirmados; separar fallos de terceros de la CI obligatoria. |
| Comparación visual | Detectar cambios inesperados en capturas cuando se estabilice el diseño. Las capturas actuales son evidencias, no comparaciones contra una referencia. |
| Previews por pull request | Revisar el sitio antes de publicar al disponer de alojamiento. Requiere separar código externo de credenciales y permisos de publicación. |
| Comprobaciones tras desplegar | HTTPS, cabeceras, rutas de ambos idiomas, errores y enlaces directos en el dominio real. |

## CD y elección de alojamiento

GitHub Actions puede desplegar una construcción estática a GitHub Pages: no hace falta mantener un servidor propio. Sin embargo, Pages no aplica el archivo `_headers` preparado por este proyecto ni ofrece configuración directa de esas cabeceras de respuesta. La CSP meta actual tiene una limitación documentada en `docs/SECURITY.md`, por lo que no debe darse por cumplida toda la política de seguridad con Pages.

Además, el nombre del repositorio no coincide con el patrón de sitio personal del propietario: una publicación como sitio de proyecto puede llevar un prefijo de ruta. Antes de elegir Pages hay que verificar la URL efectiva, adaptar `base`, enlaces y recursos si corresponde, y volver a comprobar las rutas. No basta con activar un workflow de publicación.

Un alojamiento estático que permita las cabeceras, como Cloudflare Pages, encaja con la salida `_headers` existente. No se ha seleccionado proveedor ni creado ninguna cuenta o despliegue.

Cuando Fernando autorice publicar, el flujo debe construir y verificar la revisión confiable de `main`, publicar únicamente `dist/`, limitar los permisos del job de despliegue y usar un entorno de producción restringido a la rama aprobada. Añadir aprobación manual si está disponible y se quiere controlar cada publicación. Preferir OIDC donde el proveedor lo admita; de lo contrario, un secreto de alcance mínimo separado de las pruebas de pull requests. Conservar una vía de reversión y verificar el resultado público.

Los despliegues no deben consumir sin comprobaciones artefactos producidos por código de contribuciones externas. Mantener los secretos fuera del contenido generado: una variable de entorno secreta que se incrusta en HTML o JavaScript termina siendo pública.

## Validación local de esta entrega

Comprobaciones realizadas el 1 de octubre de 2026 sobre una copia limpia, con Node 24.19.0, instalación desde el lockfile sin scripts de dependencias y Chromium instalado por la versión de Playwright del proyecto:

- Instalación reproducible completada; ninguna dependencia nueva.
- Diagnóstico de 18 archivos: cero errores, advertencias o sugerencias.
- Cinco pruebas de seguridad de enlaces aprobadas y prueba de escape en ES/EN, muestras/casos reales, aprobada.
- Construcción normal de 12 páginas y archivo de cabeceras completada.
- Once pruebas normales de navegador aprobadas con un trabajador y `--forbid-only`.
- Pruebas aisladas de muestras/casos reales/mezcla/proyecto único aprobadas; 80 comprobaciones responsive y de accesibilidad de las fixtures.
- Auditoría actual: cero vulnerabilidades conocidas notificadas.
- YAML analizado sin errores; se comprobaron permisos, eventos, referencias SHA, comandos existentes y dependencia entre jobs. Los SHA se verificaron contra las etiquetas oficiales de los repositorios de las acciones.

La copia de pruebas utilizó el puerto 4337 para evitar interferir con una vista previa local; los workflows conservan el puerto 4321 del proyecto. No se ejecutó un runner Linux de GitHub ni se probó allí la instalación de dependencias del sistema. La primera ejecución remota permanece pendiente de incorporar y subir los archivos.

Las pruebas de casos reales registraron la advertencia de CSP meta de Astro ya documentada en `docs/SECURITY.md`. Las cabeceras HTTP de la vista previa siguieron imponiendo `script-src 'none'`. Esto no cierra la revisión pendiente de la meta ni verifica cabeceras de producción.

## Referencias

- [Seguridad de GitHub Actions](https://docs.github.com/en/actions/reference/security/secure-use).
- [Playwright en CI](https://playwright.dev/docs/ci).
- [Dependabot para actualizaciones](https://docs.github.com/en/code-security/how-tos/secure-your-supply-chain/secure-your-dependencies/configure-version-updates).
- [Workflows de GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).
- [Entornos de despliegue](https://docs.github.com/en/actions/concepts/workflows-and-actions/deployment-environments).
- [Cabeceras de Cloudflare Pages](https://developers.cloudflare.com/pages/configuration/headers/).
