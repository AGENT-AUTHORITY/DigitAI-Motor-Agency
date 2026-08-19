# REDIRECTS — Legacy V1 → Growth V2

## Limitación del hosting (documentada)

El sitio se sirve desde **GitHub Pages**, que **no soporta redirects
server-side (301/302)**. No hay `_redirects` (Netlify), `vercel.json` (Vercel)
ni `.htaccess` (Apache).

### Solución elegida: meta refresh instantáneo + canonical

Google trata un `<meta http-equiv="refresh" content="0; url=...">` como
**equivalente a un 301 permanente** cuando el delay es `0`. Es la opción más
SEO-safe disponible en este hosting.

Cada stub legacy incluye:

1. `<meta http-equiv="refresh" content="0; url=/destino/">` — el redirect.
2. `<link rel="canonical" href="https://www.digitaimotor.lat/destino/">` — consolida
   la señal de autoridad en el destino.
3. `<script>location.replace('/destino/')</script>` — `replace` (no `href`) para no
   dejar la URL vieja en el historial del navegador.
4. Un enlace visible `<a href="/destino/">` — fallback para JS deshabilitado y
   para que el crawler tenga un enlace real que seguir.

**NO se aplica `noindex`** a los stubs: un `noindex` bloquearía la consolidación
de autoridad hacia el destino. Se desindexan solos vía canonical.

Astro genera estos stubs con `export const redirect` nativo, que produce
exactamente ese patrón.

## Mapa

| URL legacy | Destino | Estado | Justificación |
|---|---|---|---|
| `/paginas-web.html` | `/landing-pages/` | Redirect | Intención comercial equivalente: web que convierte. Reencuadre de "página web" a "landing que convierte". |
| `/crm-zoho.html` | `/crm-automation/` | Redirect | Mismo servicio, marca de herramienta (Zoho) removida del posicionamiento. Zoho pasa a mención, no a categoría. |
| `/automatizacion.html` | `/crm-automation/` | Redirect | Consolidación. Automatización de ventas es parte de Revenue Systems. |
| `/posicionamiento-geo.html` | `/` | Redirect | **Sin destino equivalente.** Google Maps / GBP sale del catálogo V2. Ver decisión abajo. |
| `/funnel.html` | `/quick-fix/` | Redirect | Era `noindex,nofollow`, huérfana (0 enlaces entrantes) y vendía un pack de USD 497 discontinuado. |
| `/index.html` | `/` | Redirect | Normalización de la home. |

### Decisión sobre `posicionamiento-geo.html`

Es la única legacy sin equivalente en la V2. Tres opciones evaluadas:

| Opción | Efecto |
|---|---|
| A — Redirect a `/` | Preserva autoridad. Riesgo: soft-404 si Google juzga la home irrelevante para "posicionamiento Google Maps". |
| B — Mantener viva | Contradice el reposicionamiento. Contamina la categoría. |
| C — 404 real | Pierde toda la autoridad acumulada. |

**Elegida: A.** El volumen de tráfico orgánico de esa página es desconocido —
**no hay analytics instalado en la V1** (ver `ANALYTICS.md`), por lo que no
existe dato de sesiones para decidir con evidencia.

**Acción requerida antes de deploy:** revisar Google Search Console →
Rendimiento → Páginas, filtrando `posicionamiento-geo.html` últimos 6 meses.

- Si tiene clics orgánicos relevantes → reconsiderar: crear `/posicionamiento-local/`
  como página real reencuadrada dentro de adquisición.
- Si no tiene → confirmar redirect a `/`.

Esta decisión queda **abierta y marcada**. No se cierra sin ese dato.

## QA post-deploy

- [ ] Cada URL legacy responde 200 y redirige visualmente en <100ms.
- [ ] `curl -s <legacy> | grep canonical` apunta al destino correcto (con www, con trailing slash).
- [ ] Ninguna URL legacy aparece en `sitemap.xml`.
- [ ] Search Console → Inspección de URL sobre cada legacy: "Página alternativa con etiqueta canónica adecuada".
- [ ] Search Console → Cobertura: 0 aumento de 404 en las 2 semanas posteriores.
- [ ] Reenviar sitemap nuevo en Search Console el día del deploy.
