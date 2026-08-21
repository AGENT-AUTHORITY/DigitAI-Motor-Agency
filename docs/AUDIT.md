# AUDIT — Estado de la V1 (pre-migración)

Auditoría del commit `9dcda2e`, rama `main`, tal como estaba en producción.
Preservado en la rama `backup/pre-growth-v2`.

## A. Arquitectura actual

6 archivos HTML sueltos en la raíz del repo, servidos directamente por GitHub
Pages desde `main` / root. Sin build step, sin CI, sin componentes, sin
sistema de plantillas.

| Archivo | Peso | Líneas | CSS inline | Rol |
|---|---|---|---|---|
| `index.html` | 53.9 KB | 912 | 265 líneas | Home |
| `funnel.html` | 40.2 KB | 881 | 323 líneas | Landing de venta, noindex, huérfana |
| `posicionamiento-geo.html` | 34.4 KB | 274 | 41 líneas | Servicio Google Maps |
| `crm-zoho.html` | 31.7 KB | 243 | 39 líneas | Servicio CRM |
| `paginas-web.html` | 32.7 KB | 245 | 39 líneas | Servicio web |
| `automatizacion.html` | 30.7 KB | 324 | 34 líneas | Servicio automatización |

Consecuencias: header, footer, nav y bloques de CTA están **duplicados
literalmente 6 veces**. Cambiar el número de WhatsApp implica editar 41
enlaces a mano. Cada página redefine su propio `<style>`.

## B. Dependencias

| Dependencia | Carga | Problema |
|---|---|---|
| Tailwind CSS | `cdn.tailwindcss.com` | Compilador JIT en el navegador. No apto para producción (el propio Tailwind lo advierte). Bloquea render, genera FOUC, sin purge. |
| GSAP 3.12.5 + ScrollTrigger | cdnjs | ~70 KB para animaciones que CSS resuelve. Sin SRI. |
| Syne + Outfit | Google Fonts | 2 preconnect + request bloqueante. No self-hosted. |
| `js/animations.js` | local, 15 KB | Suite GSAP propia. Respeta `prefers-reduced-motion`. |
| `js/animations/main.js` | local, 14 KB | **Huérfano.** Ningún HTML lo referencia. |

Analytics: **ninguno.** Sin GA4, sin GTM, sin Meta Pixel, sin ningún tag.
41 CTAs a WhatsApp completamente sin medición.

Formularios: **ninguno.** `grep -c '<form'` devuelve 0 en las 6 páginas.
El 100% de la captación depende de un salto a WhatsApp.

## C. Qué se puede reutilizar

- `assets/logo.svg` (1.7 KB) y `assets/favicon.svg` (1 KB) — se conservan.
- Estructura de intención comercial de las service pages (problema, features,
  pricing, FAQ, CTA) — el esqueleto sirve, el copy no.
- El bloque FAQ de `posicionamiento-geo.html` está bien escrito y es honesto.
- El dominio, el CNAME y el histórico de indexación.
- `js/animations.js` como referencia de qué animaciones existían, no como código.

## D. Qué debe eliminarse

| Elemento | Motivo |
|---|---|
| JSON-LD `aggregateRating` 4.9 / 47 reviews | Inventado. Riesgo de penalización manual. |
| JSON-LD `review` x3 (Marcos R., Sandra L., Fernando P.) | Inventados. |
| Sección `#testimonios` de `index.html` | Los mismos testimonios en HTML. |
| `meta keywords` (10 términos) | Ignorado por Google desde 2009. Señal de baja calidad. |
| `assets/hero-engine-transformation.mp4` (12.5 MB) | Autoplay sin poster ni guard. |
| `assets/tacometro-hero.mp4` (3.0 MB) | Huérfano. Nadie lo referencia. |
| `assets/circuit-pattern.png` (1.0 MB) | Huérfano en la práctica, estética descartada. |
| `assets/circuit-node.png` (819 KB) | Idem. |
| `assets/hero-bg.png` (960 KB) | Usado al 6% de opacidad. 960 KB para eso. |
| `assets/speed-lines.png` (694 KB) | Estética descartada. |
| `assets/generate-assets.html` | Utilidad de desarrollo publicada. Oculta en robots, pero accesible. |
| `js/animations/main.js` | Huérfano. |
| Tailwind CDN | Prohibido en producción. |
| Claims `10 a 15 horas` y `5 días` | Sin respaldo. |
| `funnel.html` | Oferta discontinuada (USD 497), noindex, huérfana. |

## E. Qué debe refactorizarse

- Los 6 HTML pasan a componentes Astro con layouts compartidos.
- Los 41 `wa.me` hardcodeados pasan a un helper con UTMs.
- El CSS inline pasa a `tokens.css` + `global.css` + `components.css`.
- GSAP se reemplaza por CSS/IntersectionObserver salvo justificación real.
- Google Fonts pasa a self-hosted (Manrope + Inter).
- `robots.txt` y `sitemap.xml` se regeneran con el host correcto.

## F. Qué puede afectar SEO existente

| Riesgo | Severidad |
|---|---|
| Cambio de URLs `.html` a directorios con trailing slash | Alta — mitigado con stubs de redirect |
| Eliminación de `posicionamiento-geo.html` sin equivalente | Alta — sin dato de tráfico para decidir |
| Cambio total de posicionamiento y keywords | Media — pérdida esperada y deliberada de rankings de "automatización IA" |
| Reemplazo del sitemap | Baja — mitigado reenviando en Search Console |

## G. URLs indexables actualmente

| URL | En sitemap | Canonical | Indexable |
|---|---|---|---|
| `/` | sí | no-www (redirige) | sí |
| `/paginas-web.html` | sí | no-www | sí |
| `/crm-zoho.html` | sí | no-www | sí |
| `/posicionamiento-geo.html` | sí | no-www | sí |
| `/automatizacion.html` | sí | no-www | sí |
| `/funnel.html` | no | ausente | no (`noindex, nofollow`) |
| `/assets/generate-assets.html` | no | ausente | bloqueada en robots, accesible |

## H. Redirects necesarios

Ver [`REDIRECTS.md`](REDIRECTS.md).

## I. Assets demasiado pesados

Total de `assets/`: **19 MB**. Repo completo: 58 MB.

| Asset | Peso | Estado |
|---|---|---|
| `hero-engine-transformation.mp4` | 12.5 MB | Autoplay en el hero, sin poster, sin `preload`, sin guard mobile |
| `tacometro-hero.mp4` | 3.0 MB | Huérfano |
| `circuit-pattern.png` | 1.0 MB | PNG donde correspondía SVG o CSS |
| `hero-bg.png` | 960 KB | Renderizado al 6% de opacidad |
| `circuit-node.png` | 819 KB | |
| `speed-lines.png` | 694 KB | |

Un móvil en 4G descarga ~19 MB para ver la home. Es el hallazgo de performance
más grave y el que más contradice la propuesta de valor de la V2.

## J. Riesgos antes de migrar

### Bloqueantes (requieren acción del owner)

1. **GitHub Pages sirve desde branch root.** Astro compila a `dist/`. Mergear
   sin cambiar Pages a "GitHub Actions" tira el sitio. Ver `DEPLOYMENT.md`.
2. **`posicionamiento-geo.html` sin dato de tráfico.** No hay analytics en la
   V1, así que la única fuente es Search Console. Sin ese dato, el redirect
   se decide a ciegas.

### Altos (corregidos en la V2)

3. **Canonical apunta a un host que redirige.** El CNAME es
   `www.digitaimotor.lat` y el no-www hace 301 a www, pero **todos** los
   canonical, hreflang, `og:url`, el sitemap y el robots declaran no-www.
   Verificado por `curl`.
4. **`og-image.png` devuelve 404.** Verificado en producción. Todo share en
   LinkedIn, WhatsApp o X sale sin imagen de preview.
5. **`aggregateRating` inventado.** Riesgo real de penalización manual por
   marcado estructurado engañoso.

### Medios

6. `apple-touch-icon.png` y `engine-turbine.png` referenciados y ausentes (404).
7. 11 `<img>`, ninguno con `width`/`height` ni `loading` — CLS garantizado.
8. Video autoplay sin guard de `prefers-reduced-motion` (el JS sí lo respeta,
   el `<video autoplay>` no).
9. Sin página 404 personalizada.
10. Inconsistencia `lang`: 5 páginas `es-AR`, `funnel.html` en `es`.
11. `lastmod` del sitemap desactualizado (2025-05-06 en 4 URLs).

### No bloqueantes

12. El remoto real es `abraxasgroup/DigitAI-Motor-Agency`, no
    `AGENT-AUTHORITY/DigitAI-Motor-Agency`. Vale confirmar que es el repo correcto.
13. `rel="noopener noreferrer"` correcto en los 41 enlaces externos. Sin hallazgos.
14. `js/animations.js` respeta `prefers-reduced-motion`. Bien hecho.
