# ROUTES — Arquitectura de URLs

## Convención

- Host canónico: **`https://www.digitaimotor.lat`** (el no-www hace 301 → www).
- **Trailing slash obligatorio** (`trailingSlash: 'always'` + `build.format: 'directory'`).
- Sin extensión `.html` en URLs nuevas.
- Todas las URLs en minúscula, sin acentos, separadas por guion medio.

## Fase 1 — money pages

| Ruta | Archivo | Tipo | Prioridad SEO |
|---|---|---|---|
| `/` | `src/pages/index.astro` | Home | 1.0 |
| `/performance-marketing/` | `src/pages/performance-marketing.astro` | Service hub | 0.9 |
| `/google-ads/` | `src/pages/google-ads.astro` | Service (money) | 0.9 |
| `/meta-ads/` | `src/pages/meta-ads.astro` | Service (money) | 0.9 |
| `/landing-pages/` | `src/pages/landing-pages.astro` | Service (money) | 0.9 |
| `/crm-automation/` | `src/pages/crm-automation.astro` | Service (money) | 0.9 |
| `/growth-engineering/` | `src/pages/growth-engineering.astro` | Service | 0.8 |
| `/auditoria-performance/` | `src/pages/auditoria-performance.astro` | Lead magnet | 0.9 |
| `/quick-fix/` | `src/pages/quick-fix.astro` | Lead capture | 0.8 |
| `/nosotros/` | `src/pages/nosotros.astro` | Company | 0.6 |
| `/contacto/` | `src/pages/contacto.astro` | Conversion | 0.7 |
| `/privacidad/` | `src/pages/privacidad.astro` | Legal | 0.2 |
| `/cookies/` | `src/pages/cookies.astro` | Legal | 0.2 |
| `/404` | `src/pages/404.astro` | Error | — |

## Fase 2 — pendiente

| Ruta | Motivo de aplazamiento |
|---|---|
| `/cro/` | Solapa con `/landing-pages/`. Solo si hay contenido diferenciado real. |
| `/tracking-attribution/` | Solapa con `/crm-automation/`. Idem. |
| `/casos/` | Necesita ≥2 casos publicables. Hoy hay 1 (Extragas). |
| `/casos/extragas-performance-audit/` | Requiere autorización del cliente para nombrarlo. |

## Internal linking

**Hub → spokes:** `/performance-marketing/` enlaza a `/google-ads/`,
`/meta-ads/`, `/landing-pages/`, `/crm-automation/`, `/auditoria-performance/`.

**Spokes → hub:** cada service page enlaza de vuelta a
`/performance-marketing/` vía breadcrumb.

**Cross-links laterales:**
- `/google-ads/` ↔ `/landing-pages/` (calidad de tráfico → experiencia)
- `/meta-ads/` ↔ `/crm-automation/` (lead → CRM → CAPI)
- `/landing-pages/` ↔ `/crm-automation/` (form → pipeline)
- `/growth-engineering/` ← todas (cuando el fix está fuera del Ads Manager)

**Regla:** ninguna money page puede quedar huérfana. Toda money page debe recibir
al menos 2 enlaces internos: uno desde `/` y uno desde su hub.

## Exclusiones del sitemap

- Redirects legacy (`/paginas-web.html`, `/crm-zoho.html`, `/automatizacion.html`,
  `/posicionamiento-geo.html`, `/funnel.html`)
- `/404`
- Cualquier asset o utilidad
