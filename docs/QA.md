# QA — Checklist de aceptación

## Build

- [ ] `npm run build` pasa sin errores
- [ ] `astro check` sin errores de tipos
- [ ] Cero errores en consola del navegador
- [ ] `dist/CNAME` existe y contiene `www.digitaimotor.lat`
- [ ] `dist/sitemap-index.xml` generado
- [ ] Sin assets faltantes (404 en Network)
- [ ] Sin IDs duplicados en el DOM
- [ ] Sin enlaces internos rotos

## Contenido — veracidad (bloqueante)

Buscar en todo `dist/`. Cualquier match es bloqueante:

- [ ] `4.9`, `47 reseñas`, `aggregateRating`, `reviewCount` — 0 resultados
- [ ] `Marcos R`, `Sandra L`, `Fernando P` — 0 resultados
- [ ] `10 a 15 horas`, `10-15 horas` — 0 resultados
- [ ] `5 días` como promesa de entrega — 0 resultados
- [ ] `Pack Automatización Pro`, `497` — 0 resultados
- [ ] Sin logos de clientes
- [ ] Sin testimonios
- [ ] Sin claims de ROAS, revenue, leads o conversiones generadas
- [ ] Sin certificaciones, awards ni partnerships
- [ ] Sin años específicos de experiencia en Paid Media
- [ ] Toda métrica de la proof bar tiene microcopy de origen
- [ ] El caso Extragas usa solo verbos de hallazgo

## SEO (por página)

- [ ] Un solo `<h1>`
- [ ] Jerarquía de headings sin saltos
- [ ] `<title>` único, menos de 60 caracteres visibles
- [ ] `meta description` única, 140 a 160 caracteres
- [ ] Canonical absoluto, con www y con trailing slash
- [ ] Open Graph completo, `og:image` responde 200
- [ ] Twitter Card presente
- [ ] JSON-LD válido en validator.schema.org
- [ ] Sin `AggregateRating` ni `Review`
- [ ] `FAQPage` solo si las preguntas son visibles en HTML
- [ ] `BreadcrumbList` en todas menos la home
- [ ] Enlaces internos presentes, sin money pages huérfanas
- [ ] Sin `meta keywords`
- [ ] `robots.txt` no bloquea CSS, JS ni imágenes

## Redirects legacy

- [ ] `/paginas-web.html` lleva a `/landing-pages/`
- [ ] `/crm-zoho.html` lleva a `/crm-automation/`
- [ ] `/automatizacion.html` lleva a `/crm-automation/`
- [ ] `/posicionamiento-geo.html` lleva al destino confirmado
- [ ] `/funnel.html` lleva a `/quick-fix/`
- [ ] Cada stub tiene canonical al destino
- [ ] Ningún stub aparece en el sitemap

## Performance (mobile, Lighthouse)

| Métrica | Objetivo |
|---|---|
| Performance | 90 o más |
| SEO | 95 o más |
| Accessibility | 95 o más |
| Best Practices | 95 o más |
| LCP | menos de 2.5s |
| INP | menos de 200ms |
| CLS | menos de 0.1 |

- [ ] Sin Tailwind CDN
- [ ] Sin JS crítico innecesario
- [ ] Fuentes self-hosted con `font-display: swap`
- [ ] Todas las imágenes con `width` y `height`
- [ ] WebP o AVIF donde aporte
- [ ] `loading="lazy"` bajo el fold
- [ ] Video del hero no es el LCP
- [ ] Analytics diferido
- [ ] No declarar scores que no fueron medidos

## Accesibilidad (WCAG 2.1 AA)

- [ ] HTML semántico, sin stacks de div genéricos
- [ ] Navegación completa por teclado
- [ ] Focus visible en todo elemento interactivo
- [ ] Contraste 4.5:1 en texto normal, 3:1 en texto grande
- [ ] Todo input con label asociado
- [ ] Errores de formulario anunciados con `aria-live`
- [ ] `prefers-reduced-motion` desactiva video y animaciones
- [ ] Botones vs anchors usados correctamente
- [ ] Sin divs clickeables sin rol ni handler de teclado
- [ ] Nav mobile accesible, con foco atrapado si es overlay

## Responsive

Desktop: 1440, 1280, 1024. Mobile: 375, 390, 430, 768.

- [ ] Sin scroll horizontal en ningún ancho
- [ ] Sin texto cortado
- [ ] Ningún CTA oculto o inalcanzable
- [ ] Nav usable en mobile
- [ ] Targets táctiles de 44x44px o más
- [ ] Tablas con scroll contenido

## Cross-browser

- [ ] Chrome
- [ ] Firefox
- [ ] Safari o layout compatible verificado

## Formulario

- [ ] Todos los campos validan client-side de forma accesible
- [ ] Hidden fields de UTM se completan
- [ ] `landing_page` y `referrer` se capturan
- [ ] Estados de error legibles y anunciados
- [ ] Estado de éxito claro
- [ ] Sin secrets en el cliente

## Analytics

- [ ] Sin IDs inventados en el código
- [ ] Sin ID configurado, sin script inyectado
- [ ] Eventos disparan con los parámetros documentados
- [ ] `.env` no está en git

## Seguridad

- [ ] Todo enlace externo con `rel="noopener noreferrer"`
- [ ] Sin API keys en el cliente
- [ ] Sin HTML sin sanitizar
- [ ] Sin `console.log` de debug

## Negocio (regla de los 10 segundos)

Un visitante nuevo entiende, sin scrollear más de un viewport:

- [ ] Qué hacemos
- [ ] Para quién
- [ ] Qué problema resolvemos
- [ ] Qué nos diferencia
