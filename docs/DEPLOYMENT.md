# DEPLOYMENT

## Situación actual (V1) — riesgo principal de la migración

El sitio se sirve desde **GitHub Pages, rama `main`, carpeta raíz**.
Los `.html` viven en la raíz del repo y Pages los publica tal cual.
No hay workflow de CI (`.github/` no existía).

Astro **no funciona así**: compila a `dist/`. Si se mergea la V2 a `main` sin
antes cambiar la configuración de Pages, Pages seguiría sirviendo los `.html`
viejos de la raíz, o serviría el repo Astro crudo (que no tiene `index.html`
en raíz) y el sitio caería.

### Cambio requerido en GitHub (acción manual del owner)

En `Settings > Pages > Build and deployment > Source`, cambiar
`Deploy from a branch` por `GitHub Actions`.

Es reversible volviendo a seleccionar la rama. Aun así, no se ejecuta sin
aprobación expresa.

## CNAME

`CNAME` contiene `www.digitaimotor.lat`. En un build de Astro el archivo debe
estar en `public/CNAME` para que termine en `dist/CNAME`. Ya copiado.

Si `CNAME` falta en el output, GitHub Pages descarta el dominio custom y el
sitio pasa a responder en `abraxasgroup.github.io`. Es el fallo más común de
esta migración y está cubierto por un check en el workflow.

## Workflow

`.github/workflows/deploy.yml`. Estado: **creado pero desactivado**
(`workflow_dispatch` únicamente, sin trigger en push). Se activa recién cuando
el owner lo apruebe.

Pasos: checkout, setup-node 22 con caché npm, `npm ci`, `npm run build`,
verificación de que `dist/CNAME` existe, upload artifact, deploy a Pages.

## Comandos

| Comando | Uso |
|---|---|
| `npm install` | Instalar dependencias |
| `npm run dev` | Servidor local en el puerto 4321 |
| `npm run build` | `astro check` mas build a `dist/` |
| `npm run build:fast` | Build sin type-check |
| `npm run preview` | Servir `dist/` local, con `--host` para probar desde el celular |

## Staging

GitHub Pages no da preview deployments. Dos opciones para revisión visual antes
del merge:

1. **Local (elegida para esta fase):** `npm run build` y luego `npm run preview`.
   Con `--host` la URL de red permite abrir el sitio desde un celular real,
   que es donde importa el QA de este proyecto.
2. **Vercel o Netlify preview:** conectar la rama `feature/growth-v2` a un
   proyecto de preview con dominio temporal. Requiere decisión del owner.
   No toca DNS del dominio de producción.

## Checklist de lanzamiento

**No confiar en memoria.** Este es el orden exacto. Cada paso depende del
anterior.

### Antes de tocar nada

- [ ] Revisión visual aprobada por el owner en local
- [ ] Decisión tomada sobre `posicionamiento-geo.html` con dato de Search Console
- [ ] `og-default.webp` 1200×630 existe y se ve bien en el validador de LinkedIn
- [ ] `favicon.ico` y `apple-touch-icon.png` generados desde `favicon.svg`
- [ ] Endpoint del formulario definido y probado, o decisión explícita de seguir con el handoff a WhatsApp

### Publicación

1. [ ] **`SITE_IS_PUBLIC = true`** en `astro.config.mjs`
2. [ ] **Retirar `noindex`** — en `BaseLayout` (home) y en `ServiceLayout` (`noindex = false` por defecto)
3. [ ] **`npm run build`** y verificar que el sitemap ahora sí lista las páginas indexables
4. [ ] **Canonical:** todas con `https://www.digitaimotor.lat` y trailing slash
5. [ ] **`robots.txt`:** regenerado con el `Sitemap:` apuntando a www, sin bloquear CSS/JS/imágenes
6. [ ] **Redirects legacy:** los 6 stubs responden y su canonical apunta al destino correcto
7. [ ] **Pages a GitHub Actions:** `Settings > Pages > Source` — sin esto el merge tira el sitio
8. [ ] **Merge y deploy:** verificar que `dist/CNAME` sobrevivió al build
9. [ ] **Search Console:** reenviar `sitemap-index.xml`, inspeccionar las URLs legacy
10. [ ] **Analytics:** cargar `PUBLIC_GA4_ID`, `PUBLIC_GTM_ID`, `PUBLIC_META_PIXEL_ID` y verificar eventos en DebugView

### Después de publicar

- [ ] QA en producción: las 9 páginas cargan, HTTPS ok, dominio custom ok
- [ ] Lighthouse mobile sobre home y sobre una service page
- [ ] Search Console → Cobertura durante 14 días: sin aumento de 404
- [ ] Verificar que ninguna página quedó huérfana

### Rollback

`Settings > Pages > Source > Deploy from a branch > backup/pre-growth-v2 > (root)`

Restaura la V1 completa sin tocar git ni DNS.

### Interruptor único

`SITE_IS_PUBLIC` en `astro.config.mjs` controla el sitemap. Mientras sea
`false`, el sitemap sale vacío a propósito: un sitemap que lista páginas
`noindex` es una contradicción que Search Console reporta como error.

El `noindex` en sí vive en los layouts y se retira por separado — son dos
gestos distintos justamente para que ninguno se active por accidente.

## Rollback

Backup en la rama `backup/pre-growth-v2`, apuntando a `9dcda2e`, el estado
exacto de producción al inicio de la migración.

Para revertir: `Settings > Pages > Source > Deploy from a branch >
backup/pre-growth-v2 > (root)`.

Restaura la V1 completa sin tocar git ni DNS. Segundos, no minutos.

## Nunca

- No tocar DNS.
- No modificar el contenido de `CNAME`.
- No borrar `backup/pre-growth-v2`.
- No hacer force push a `main`.
