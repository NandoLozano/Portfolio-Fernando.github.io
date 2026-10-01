# Seguridad de la primera versión

Revisión local: 1 de octubre de 2026. Alcance: sitio estático ES/EN, herramientas de construcción, navegación y resultado `dist/`. No hay backend, autenticación, formularios, cookies, analítica ni integraciones externas. La auditoría automática no demuestra ausencia de vulnerabilidades.

## Medidas aplicadas

- Plantillas Astro con escape automático. Sin `set:html`, `innerHTML`, ejecución de cadenas ni MDX de terceros. Prueba controlada de contenido adversario en título, texto y atributos de metadatos con los componentes reales de ambos idiomas.
- Contactos confirmados únicamente. Validación de HTTPS, hosts exactos y rutas de perfiles, sin credenciales embebidas, puertos alternativos ni redirecciones mediante query. El correo rechaza parámetros y saltos de línea. Las pruebas incluyen protocolos ejecutables, subdominios engañosos e inyección de cabeceras.
- Cero scripts enviados al navegador; fuentes y SVG locales. Sin iframes ni solicitudes de terceros. Enlaces externos con `noopener noreferrer`.
- CSP por cabecera en la vista previa y CSP meta generada por Astro en cada HTML. `default-src 'none'`, `script-src 'none'`, estilos e imágenes del propio origen, sin `unsafe-inline` ni `unsafe-eval`. La cabecera incluye `frame-ancestors 'none'`; la meta no la sustituye.
- `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy` y `X-Frame-Options: DENY`. Definidas en `security.config.mjs`, aplicadas por Vite preview y exportadas a `dist/_headers`.
- Escucha local en `127.0.0.1`. La salida no incluye el HTML original, fotos, vídeo, referencias, documentación, fuentes de código, dependencias o archivos de entorno. El `.gitignore` protege entornos, claves y herramientas locales. No se han leído credenciales personales.
- Dependencias exactas y `package-lock.json` con npm. Astro 7.3.5, Tailwind 4.3.3, TypeScript 6.0.3 compatible con `astro check`. npm 12 bloqueó el postinstall opcional de esbuild; la construcción funciona con su binario del paquete de plataforma sin habilitarlo.
- Telemetría opcional de Astro desactivada en los comandos del proyecto. Muestras bloqueadas para indexación mediante meta, cabecera y `robots.txt`; esto no es un control de acceso.

## Hallazgos y resolución

| Hallazgo | Resolución |
| --- | --- |
| TypeScript 7 no compatible con `astro check` actual | Fijado TypeScript 6.0.3; comprobación sin errores ni avisos. |
| Shiki advertía sobre estilos inline incompatibles con CSP | Resaltado Markdown desactivado; no se necesita en los casos actuales. |
| Datos de contacto anteriores eran muestras | No se migraron; valores nulos y estados informativos, sin enlaces ficticios. |
| Fuentes privadas/originales en el repositorio | Solo se construye/publicaría `dist/`; verificación de respuestas 404 a rutas de origen. |
| Limpieza del proceso de prueba en Windows quedaba esperando | La prueba controla el servidor Astro dentro del mismo proceso y lo cierra mediante su API. |

## Pendiente del alojamiento

No se ha publicado ni comprobado ningún dominio. Las cabeceras locales no prueban su aplicación pública. `_headers` sirve como preparación para plataformas compatibles, por ejemplo Cloudflare Pages; no selecciona proveedor ni despliega nada. GitHub Pages no interpreta ese archivo.

Antes de publicar: comprobar HTTPS, CSP y todas las cabeceras mediante respuestas reales de ambos idiomas, archivos y errores; confirmar redirecciones y rutas directas; configurar errores por idioma según el proveedor; ajustar rutas si se usa un subdirectorio. Aplicar HSTS únicamente tras validar HTTPS y el dominio, sin `includeSubDomains` ni precarga por defecto.

Los permisos de GitHub y alojamiento, MFA, protección de ramas, secretos de CI y recuperación de cuentas no se han auditado ni cambiado. Una futura automatización debe tener permisos mínimos y acciones fijadas a revisiones verificadas. No incluir credenciales en `PUBLIC_*`, capturas, repositorios ni enlaces de demo.

Antes de cada entrega pública, ejecutar `npm ci`, las comprobaciones del README y `npm audit`. Revisar avisos de desarrollo y transitivos también; actualizar de forma concreta, sin `npm audit fix --force` a ciegas, y repetir las pruebas afectadas. Conservar un despliegue anterior recuperable y revertir mediante el proveedor o una revisión de Git conocida. Si se expone una credencial, revocar/rotar primero y retirar después el material expuesto.

## Fuentes de implementación

- [CSP de Astro](https://docs.astro.build/en/reference/configuration-reference/#securitycsp): la CSP integrada se comprueba en build/preview, no en dev.
- [Tailwind con Astro](https://tailwindcss.com/docs/installation/framework-guides/astro): integración mediante el plugin de Vite.
- [Cabeceras estáticas de Cloudflare Pages](https://developers.cloudflare.com/pages/configuration/headers/): formato de `_headers`, sujeto al proveedor elegido.

Si el alcance incorpora API, envío de mensajes o autenticación, ampliar la revisión como prevé `contexto-codex/PLAN.md` antes de conectar servicios reales.
