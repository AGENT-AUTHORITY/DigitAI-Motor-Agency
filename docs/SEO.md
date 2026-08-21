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

---

# FASE 4 — Estado medido de las service pages

Medido sobre `dist/` al cierre de FASE 4, no declarado.

| Chequeo | Resultado |
|---|---|
| Rutas construidas | 9 |
| `noindex, nofollow` | 9/9 |
| Canonical `https://www.` | 9/9 |
| Un solo `<h1>` por página | 9/9 |
| `<title>` duplicados | 0 |
| `description` duplicadas | 0 |
| `<h1>` duplicados | 0 |
| `og:title` / `og:description` | 9/9 |
| BreadcrumbList | 8/8 service pages |
| Service schema | 8/8 service pages |
| `offers` / `priceRange` / `aggregateRating` / `review` | 0 |
| Enlaces internos rotos | 0 |
| Anclas rotas (66 verificadas) | 0 |
| Enlaces protocol-relative (`//`) | 0 |
| IDs duplicados | 0 |
| Assets locales faltantes | 0 |

La home no lleva BreadcrumbList (es la raíz) ni Service schema: usa
`Organization` + `ProfessionalService`.

## Longitudes

`description` de las 9 páginas entre 123 y 162 caracteres. `title` entre 49 y
59, salvo la home con 64 — dentro de lo razonable y la home está congelada.

## Bug corregido

`/google-ads/` y `/performance-creative/` compilaban su CTA primario como
`href="//#growth-audit"`. El navegador lee `//` como URL protocol-relative, así
que el CTA principal de dos service pages **no navegaba a ningún lado**.
Venía de interpolar `` `/${ANCHORS.growthAudit}` `` cuando `ANCHORS.growthAudit`
ya empezaba con `/`. Hoy ambas usan `intentLink()`.

## Pendiente antes de publicar

- `og-default.webp`, `favicon.ico`, `apple-touch-icon` — sin generar.
- `SITE_IS_PUBLIC = false`: el sitemap se emite vacío a propósito y el build
  avisa `No pages found!`. Es el comportamiento buscado mientras haya `noindex`.
- `/privacy/` y `/cookies/` no existen.
- Redirects legacy sin definir.

---

# FASE 5 — Open Graph, iconos y simulación pública

## Social card

`public/assets/og-default.png` — 1200×630, PNG, 57 KB.

PNG y no WebP a propósito: LinkedIn y WhatsApp no resuelven WebP de forma
confiable en la preview.

Se emite en las 12 páginas como imagen por defecto, con `og:image:width`,
`og:image:height`, `og:image:type` y `og:image:alt`. `twitter:card` es
`summary_large_image` en todas.

La V1 declaraba `/assets/og-image.png` sin que el archivo existiera: cada vez
que alguien compartía el sitio, salía sin preview.

## Iconos

| Archivo | Detalle |
|---|---|
| `assets/favicon.svg` | Sacred Weave, variante micro |
| `favicon.ico` | 16 / 32 / 48 en un contenedor con PNG embebido |
| `apple-touch-icon.png` | 180×180, **sin** esquinas redondeadas propias |

El de 16px usa una variante con el trazo engrosado a 44 sobre viewBox 320: con
el trazo normal de 24, a 16px mide 1,2 px reales y se deshace en el antialias.
Se recorta la vuelta interior, que a ese tamaño solo agrega ruido. Es la misma
identidad, no otra.

El apple-touch va sin redondear porque iOS aplica su propia máscara; con
esquinas propias quedaría doble redondeo y una franja de fondo en el borde.

## Simulación pública — verificado

`PUBLIC_SITE_IS_PUBLIC=true npm run build`:

| Chequeo | Resultado |
|---|---|
| Páginas con `noindex` | Solo `/404.html` |
| URLs en el sitemap | 11, todas `https://www.` |
| 404 en el sitemap | No |
| Legacy en el sitemap | No |
| `robots.txt` | `Allow: /` + `Sitemap: https://www.digitaimotor.lat/sitemap-index.xml` |
| Nombre real del sitemap | `sitemap-index.xml` — verificado en el output, no asumido |
| Canonical | 12/12 `https://www.`, una por página |

Estado seguro tras la prueba: `robots.txt` con `Disallow: /` y 12/12 con
`noindex`.

## Title de la home — medido, sin cambio

Se venía arrastrando como "64 caracteres, por encima del límite". El límite
real de Google es **ancho en píxeles**, no caracteres.

Medido con Arial 20px, que es lo que usa el SERP de escritorio:

| Título | px | ¿Trunca? |
|---|---|---|
| `Growth Partner \| Performance, Creative & CRO \| digitAI Motor` | **549** | **No** (límite ~600) |

**No truncaba.** Se mantiene: entra completo, conserva la marca al final y
lleva las keywords. Las alternativas más cortas no aportaban nada.

## Corrección de accesibilidad

`label-content-name-mismatch` (WCAG 2.5.3, nivel A) en el lockup de marca del
header y del footer.

El espacio entre "AI" y "Motor" lo hacía un margen CSS, así que el texto
visible era `digitAIMotor` mientras el nombre accesible decía
`digitAI Motor — inicio`. Para control por voz, decir "digitAI Motor" no
coincidía con la etiqueta visible.

Corregido: el espacio pasa a ser un carácter real y el margen se reduce para
compensar exactamente su ancho. Geometría verificada antes y después:
**111,59 px de ancho y Motor en x=148,84 en ambos casos.** Cero cambio visual.
