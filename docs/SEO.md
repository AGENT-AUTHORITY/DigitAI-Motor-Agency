# SEO — digitAI Motor V2

## Host canónico — corrección crítica heredada

| | V1 (roto) | V2 |
|---|---|---|
| CNAME | `www.digitaimotor.lat` | `www.digitaimotor.lat` |
| Comportamiento real | `digitaimotor.lat` → **301** → `www.digitaimotor.lat` | igual |
| Canonical declarado | `https://digitaimotor.lat/` ❌ | `https://www.digitaimotor.lat/` ✅ |
| Sitemap | URLs no-www ❌ | URLs www ✅ |
| robots.txt Sitemap | no-www ❌ | www ✅ |
| hreflang | no-www ❌ | www ✅ |
| og:url | no-www ❌ | www ✅ |

La V1 declaraba en **cada página** un canonical que apuntaba a una URL que
redirige 301. Y el sitemap contenía **100% URLs que redirigen**. Google lo
resuelve, pero es señal diluida y presupuesto de rastreo desperdiciado.

**Regla V2:** todo canonical, hreflang, `og:url` y entrada de sitemap usa
`https://www.digitaimotor.lat` + trailing slash. Se genera desde `site` en
`astro.config.mjs` — nunca hardcodeado.

## Metadata por página

### `/`
- **Title:** `Performance & Growth Marketing | Google Ads, Meta Ads & CRO | digitAI Motor`
- **Description:** `Performance marketing, Google Ads, Meta Ads, CRO, landing pages, analytics, CRM y automatización. Encontramos dónde se pierde rendimiento desde el clic hasta la venta.`
- **H1:** `Convertimos adquisición digital en crecimiento medible.`
- **Canonical:** `https://www.digitaimotor.lat/`

### `/google-ads/`
- **Title:** `Gestión y Auditoría Google Ads | Performance Marketing | digitAI Motor`
- **H1:** `Google Ads optimizado para negocio, no para métricas bonitas.`
- **Intent:** gestión Google Ads · especialista Google Ads · agencia Google Ads · auditoría Google Ads · Google Ads Argentina
- **Cobertura mínima:** Search · Display · negative keywords · intent · conversion tracking · landing experience · optimization · audit · budget · lead quality

### `/meta-ads/`
- **Title:** `Gestión de Meta Ads y Facebook Ads | digitAI Motor`
- **H1:** `Meta Ads conectado con oportunidades reales.`
- **Cobertura:** lead generation · WhatsApp · creatives · targeting · remarketing · conversion events · attribution · Pixel · CAPI · lead quality

### `/landing-pages/`
- **Title:** `Landing Pages y CRO para Convertir Más | digitAI Motor`
- **H1:** `Más tráfico no arregla una landing que no convierte.`
- **Cobertura:** CRO · speed · copy · CTA · forms · mobile · tracking · experiments · lead quality

### `/crm-automation/`
- **Title:** `CRM y Automatización Comercial | digitAI Motor`
- **H1:** `Convertí leads en procesos comerciales medibles.`
- **Cobertura:** CRM · WhatsApp · follow-up · pipeline · automation · attribution · routing · reminders · integration
- **Nota:** Zoho aparece como herramienta mencionada, **no** como eje de posicionamiento.

### `/performance-marketing/`
- **H1:** `Performance Marketing conectado con revenue.`
- **Rol:** service hub. Enlaza a Google Ads, Meta Ads, Landing Pages, CRM, Auditoría.

### `/growth-engineering/`
- **H1:** `Construimos la infraestructura que Growth necesita para escalar.`
- **Cobertura:** development · automation · CRM · dashboards · internal tools · APIs · AI · tracking · integrations

### `/auditoria-performance/`
- **H1:** `Encontrá dónde se está perdiendo tu presupuesto antes de invertir más.`
- **Objetivo:** lead generation. Qué auditamos: campaigns · tracking · landing · funnel · CRM · attribution.
- **CTA:** `Solicitar auditoría`

## Reglas duras

- **Una sola `<h1>` por página.** Jerarquía H1 → H2 → H3 sin saltos.
- **Sin `<meta name="keywords">`.** La V1 tenía un keyword stuffing de 10 términos. Eliminado — Google lo ignora desde 2009 y es señal de sitio de baja calidad.
- **Sin títulos ni descriptions duplicados** entre páginas.
- **Sin money pages huérfanas** (mínimo 2 enlaces internos entrantes).
- Todo `alt` descriptivo. Imágenes decorativas → `alt=""` + `aria-hidden`.
- Todo enlace externo → `rel="noopener noreferrer"`.

## Structured data

| Página | Schemas |
|---|---|
| `/` | `Organization` + `ProfessionalService` |
| Service pages | `Service` + `BreadcrumbList` |
| Páginas con FAQ | `FAQPage` **solo** si las preguntas son visibles en HTML |
| Todas menos `/` | `BreadcrumbList` |

### Eliminado de la V1 — no reintroducir

```
❌ AggregateRating  ratingValue 4.9 / reviewCount 47   → sin respaldo
❌ Review × 3       Marcos R. / Sandra L. / Fernando P. → sin respaldo
```

Estaban en el JSON-LD de `index.html` **y** renderizados en la sección
`#testimonios`. Ambas instancias se eliminan.

**No se reintroduce `AggregateRating` hasta tener reviews reales verificables**
(Google Business Profile o plataforma equivalente con URL pública).

Riesgo evitado: structured data marcado como spam → penalización manual por
`Marcado estructurado engañoso` en Search Console.

Validar todo JSON-LD en https://validator.schema.org/ antes de deploy.

## Sitemap

Generado por `@astrojs/sitemap`. Solo URLs indexables. Excluye redirects legacy
y `/404`. `lastmod` real del build — no fechas inventadas.

**V1 tenía `lastmod: 2025-05-06` en 4 páginas y `2026-05-26` en la home** —
fechas manuales desactualizadas que restan credibilidad al sitemap.

## robots.txt

```
User-agent: *
Allow: /

Sitemap: https://www.digitaimotor.lat/sitemap-index.xml
```

Cambios frente a V1:
- Sitemap apunta a **www** (V1: no-www).
- Se elimina `Disallow: /assets/generate-assets.html` — el archivo se borra, no se oculta.
- Se eliminan los `Crawl-delay` para AhrefsBot / SemrushBot / MJ12bot: Google los ignora, no aportan y solo entorpecen auditorías propias.
- **No bloquear CSS, JS ni imágenes** — Google necesita renderizar.

## Open Graph

**Bug crítico de la V1:** `og:image` apuntaba a `/assets/og-image.png`, que
**devuelve 404 en producción** (verificado). Todo share en LinkedIn, WhatsApp o
X salía sin imagen de preview. Para alguien haciendo outbound en LinkedIn con
44K impresiones, eso costaba clics directamente.

V2: `og-image` real 1200×630, verificado en build. Mismo chequeo para
`apple-touch-icon.png` (también 404 en V1).
