# SEO — digitAI Motor

## Host canónico — corrección crítica heredada

| | V1 (roto) | V2 |
|---|---|---|
| CNAME | `www.digitaimotor.lat` | igual |
| Comportamiento real | `digitaimotor.lat` hace **301** a `www.digitaimotor.lat` | igual |
| Canonical declarado | `https://digitaimotor.lat/` INCORRECTO | `https://www.digitaimotor.lat/` |
| Sitemap | URLs no-www | URLs www |
| robots.txt | Sitemap no-www | Sitemap www |
| hreflang | no-www | pendiente hasta que exista `/en/` |
| og:url | no-www | www |

La V1 declaraba en **cada página** un canonical que apunta a una URL que
redirige, y su sitemap contenía 100% URLs que redirigen. Google lo resuelve,
pero es señal diluida y presupuesto de rastreo desperdiciado.

**Regla:** todo canonical, `og:url` y entrada de sitemap se deriva de `site`
en `astro.config.mjs`. Nunca hardcodeado.

## Homepage

- **Title:** `Growth Partner | Performance, Creative & CRO | digitAI Motor`
  (63 caracteres — dentro del límite práctico de ~60-65 antes del truncado).
- **Meta description:** `Growth Marketing, Paid Media, Performance Creative, CRO, tracking y automatización conectados desde el tráfico hasta la venta. Primero encontramos qué frena el crecimiento.`
- **H1:** `Encontramos qué está frenando tu crecimiento. Después lo arreglamos.`
- **Canonical final:** `https://www.digitaimotor.lat/`
- **Estado actual:** `noindex, nofollow` durante el checkpoint. Se quita al aprobar.

Persona primero, buscador después. Sin keyword stuffing.

## Intención de búsqueda por página (futuras)

| Ruta | Intent principal |
|---|---|
| `/growth-audit/` | auditoría de marketing digital, auditoría Google Ads, por qué no convierten mis campañas |
| `/performance-creative/` | creative testing, performance creative, hooks para ads, ad creative strategy |
| `/paid-media/` | agencia performance marketing, paid media Argentina |
| `/google-ads/` | gestión Google Ads, especialista Google Ads, auditoría Google Ads |
| `/meta-ads/` | gestión Meta Ads, Facebook Ads, campañas a WhatsApp |
| `/cro-landing-pages/` | CRO, optimización de conversión, landing que convierte |
| `/tracking-analytics/` | GA4, GTM, conversion tracking, atribución |
| `/crm-automation/` | CRM, automatización comercial, seguimiento de leads |
| `/growth-engineering/` | dashboards a medida, integraciones, herramientas internas |
| `/quick-fix/` | pixel roto, Meta Business bloqueado, conversiones mal configuradas |

Zoho puede mencionarse como herramienta. **No** se construye posicionamiento
alrededor de Zoho.

## Reglas duras

- **Una sola `<h1>` por página.** Jerarquía H1, H2, H3 sin saltos.
- **Sin `<meta name="keywords">`.** La V1 tenía stuffing de 10 términos.
- Sin títulos ni descriptions duplicados.
- Sin money pages huérfanas (mínimo 2 enlaces internos entrantes).
- Todo `alt` descriptivo. Decorativas con `alt=""` y `aria-hidden`.
- Todo enlace externo con `rel="noopener noreferrer"`.
- **Ningún CTA puede apuntar a un 404.** Ver `ROUTES.md`.

## Structured data

| Página | Schemas |
|---|---|
| `/` | `Organization` + `ProfessionalService` + `FAQPage` |
| Service pages | `Service` + `BreadcrumbList` |
| Todas menos `/` | `BreadcrumbList` |

`FAQPage` solo si las preguntas están visibles en HTML. Las 5 FAQ de la home
cumplen: el schema se genera del mismo array que renderiza el markup, así que
no puede desincronizarse.

### Eliminado de la V1 — no reintroducir

```
AggregateRating  ratingValue 4.9 / reviewCount 47    sin respaldo
Review x3        Marcos R. / Sandra L. / Fernando P. sin respaldo
```

Estaban en el JSON-LD de `index.html` **y** renderizados en `#testimonios`.

No se reintroduce `AggregateRating` hasta tener reviews reales verificables
con URL pública. Riesgo evitado: penalización manual por *marcado estructurado
engañoso*.

Validar todo JSON-LD en https://validator.schema.org/ antes de deploy.

## Open Graph

**Bug crítico de la V1:** `og:image` apuntaba a `/assets/og-image.png`, que
**devuelve 404 en producción** (verificado). Todo share en LinkedIn, WhatsApp
o X salía sin imagen de preview.

**Estado V2:** `BaseLayout` emite `og:image` **solo si recibe una imagen
real**. Sin ella degrada a `twitter:card summary`. Repetir el tag apuntando a
un archivo inexistente sería el mismo bug.

**Pendiente:** `/assets/og-default.webp` a 1200×630. Se diseña aparte, no se
autogenera una pieza mediocre.

## Sitemap

Generado por `@astrojs/sitemap`. Solo URLs indexables. Excluye redirects
legacy, `/404` y cualquier página `noindex`. `lastmod` real del build.

La V1 tenía `lastmod: 2025-05-06` fijo en 4 páginas — fechas manuales
desactualizadas que restan credibilidad.

## robots.txt

```
User-agent: *
Allow: /

Sitemap: https://www.digitaimotor.lat/sitemap-index.xml
```

Cambios frente a V1: sitemap apunta a www; se elimina
`Disallow: /assets/generate-assets.html` (el archivo se borra, no se oculta);
se eliminan los `Crawl-delay` de AhrefsBot / SemrushBot / MJ12bot (Google los
ignora y solo entorpecen auditorías propias). No bloquear CSS, JS ni imágenes.

## Internacionalización

`hreflang` **no se declara todavía**: apuntaría a URLs inexistentes. Se agrega
cuando exista `/en/`. Ver `ROUTES.md` para las decisiones estructurales ya
tomadas.

## Geo

`Cañuelas · Buenos Aires · Argentina` + `Remote across LATAM` en el footer y
en `ProfessionalService`. **No** crear páginas geo spam por ciudad, que es lo
que hacía `posicionamiento-geo.html`.
