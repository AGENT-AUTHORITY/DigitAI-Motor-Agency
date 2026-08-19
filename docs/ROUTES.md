# ROUTES — Arquitectura de URLs

## Convención

- Host canónico: **`https://www.digitaimotor.lat`** (el no-www hace 301 a www).
- **Trailing slash obligatorio** (`trailingSlash: 'always'` + `build.format: 'directory'`).
- Sin extensión `.html` en URLs nuevas.
- Minúsculas, sin acentos, separadas por guion medio.

## Arquitectura objetivo

Refleja la arquitectura comercial pública: Growth Audit es la puerta principal
y Performance Creative es pilar, no sub-bullet de Paid Media.

| Ruta | Rol | Estado |
|---|---|---|
| `/` | Home | **FASE 3 — construida, noindex** |
| `/growth-audit/` | Puerta principal, lead magnet | pendiente |
| `/performance-creative/` | Pilar diferencial | pendiente |
| `/paid-media/` | Hub de adquisición | pendiente |
| `/google-ads/` | Money page | pendiente |
| `/meta-ads/` | Money page | pendiente |
| `/cro-landing-pages/` | Money page | pendiente |
| `/tracking-analytics/` | Money page | pendiente |
| `/crm-automation/` | Money page | pendiente |
| `/growth-engineering/` | Servicio | pendiente |
| `/quick-fix/` | Modalidad de entrada | pendiente |
| `/work/` | Casos | pendiente |
| `/about/` | Company + founder | pendiente |
| `/contact/` | Conversión | pendiente |
| `/privacy/` | Legal | pendiente |
| `/cookies/` | Legal | pendiente |
| `/404` | Error | pendiente |

### Cambios respecto de la arquitectura anterior

| Antes | Ahora | Motivo |
|---|---|---|
| `/performance-marketing/` | `/paid-media/` | "Performance" ahora describe toda la marca, no un servicio |
| — | `/growth-audit/` | Es la puerta comercial principal |
| — | `/performance-creative/` | Promovido a pilar |
| `/landing-pages/` | `/cro-landing-pages/` | Cubre CRO además de la landing |
| — | `/tracking-analytics/` | Sale de `crm-automation` y gana página propia |
| `/auditoria-performance/` | `/growth-audit/` | Consolidación |
| `/nosotros/` `/contacto/` `/privacidad/` | `/about/` `/contact/` `/privacy/` | Consistencia con `/work/` y preparación i18n |

## Enlaces temporales en la home

La home ya existe pero las service pages no. **Ningún CTA puede apuntar a un
404.** Mientras tanto:

| CTA de la home | Destino provisional | Destino final |
|---|---|---|
| Solicitar diagnóstico de crecimiento | `#growth-audit` | `/growth-audit/` |
| Tengo un problema puntual | `#quick-fix` | `/quick-fix/` |
| Contame qué está fallando | `#growth-audit` | `/quick-fix/` |
| Solicitar análisis creativo | `#growth-audit` | ver nota abajo |
| Ver perfil en LinkedIn | URL externa real | igual |

**Nota sobre el CTA de Performance Creative.** El label provisional es
`Solicitar análisis creativo` y no `Explorar Performance Creative`: "explorar"
promete una navegación a una página dedicada que todavía no existe, y llevar ese
label a un ancla del formulario es inconsistente. Cuando
`/performance-creative/` se publique en FASE 4/5, el CTA vuelve a
`Explorar Performance Creative` apuntando a esa ruta, y el pedido de análisis
pasa a ser el CTA secundario de esa página.

Los enlaces del Header y el Footer que apuntan a rutas todavía inexistentes
están marcados en `src/data/navigation.ts` con `pending: true` y se renderizan
como texto inerte, no como enlaces rotos. Se activan al crear cada página.

## Internal linking (cuando existan las páginas)

**Hub → spokes:** `/paid-media/` enlaza a `/google-ads/`, `/meta-ads/`,
`/cro-landing-pages/`, `/tracking-analytics/`, `/growth-audit/`.

**Spokes → hub:** cada service page vuelve vía breadcrumb.

**Cross-links laterales:**
- `/google-ads/` con `/cro-landing-pages/` — calidad de tráfico y experiencia
- `/meta-ads/` con `/performance-creative/` — creative como palanca de Paid
- `/performance-creative/` con `/cro-landing-pages/` — mensaje y conversión
- `/tracking-analytics/` con `/crm-automation/` — medición y proceso comercial
- `/growth-engineering/` recibe enlaces de todas cuando el fix está fuera de Ads

**Regla:** ninguna money page huérfana. Mínimo 2 enlaces internos entrantes.

## Internacionalización

Arquitectura preparada, **traducción no implementada**.

```
/            español (root)
/en/         inglés (futuro)
```

Decisiones ya tomadas para que agregar `/en/` no sea traumático:

1. Ningún componente hardcodea strings de navegación: todo sale de
   `src/data/navigation.ts`.
2. El canónico se deriva de `Astro.site` + `Astro.url.pathname`, nunca se
   escribe a mano — un prefijo de idioma se propaga solo.
3. `BaseLayout` recibe `lang` como prop con default `es-AR`, así que el
   `<html lang>` y `og:locale` no quedan clavados.
4. Las rutas nuevas usan nombres en inglés (`/work/`, `/about/`, `/contact/`)
   salvo donde el intent de búsqueda en español manda.
5. `hreflang` se agregará recién cuando exista la versión inglesa. Declararlo
   antes apuntaría a URLs inexistentes.

## Exclusiones del sitemap

- Redirects legacy (`/paginas-web.html`, `/crm-zoho.html`,
  `/automatizacion.html`, `/posicionamiento-geo.html`, `/funnel.html`)
- `/404`
- Cualquier página en `noindex`, incluida la home durante el checkpoint

## Legacy

Los 6 HTML de la V1 siguen intactos en la raíz. **No se ejecuta ningún
redirect todavía.** Ver `REDIRECTS.md`. La decisión sobre
`posicionamiento-geo.html` sigue abierta y sin dato de Search Console.
