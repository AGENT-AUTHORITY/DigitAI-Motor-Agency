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

## Secuencia de deploy (cuando se apruebe)

1. Revisión visual local aprobada.
2. Confirmar decisión sobre `posicionamiento-geo.html` con dato de Search Console.
3. Cargar variables `PUBLIC_*` reales.
4. Cambiar Pages a GitHub Actions.
5. Merge de `feature/growth-v2` a `main`.
6. Verificar que el workflow corre verde y que `dist/CNAME` está presente.
7. Verificar en producción: home carga, HTTPS ok, dominio custom ok.
8. Probar las 6 URLs legacy manualmente.
9. Reenviar `sitemap-index.xml` en Search Console.
10. Monitorear Cobertura en Search Console durante 14 días.

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
