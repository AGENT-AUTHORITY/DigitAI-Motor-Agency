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
- [ ] Targets táctiles: mínimo 24x24px (WCAG 2.5.8, nivel AA). Objetivo propio 44px de alto en enlaces y botones
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

---

# FASE 4 — Resultados medidos

Fecha de corrida: cierre de FASE 4. Todo verificado sobre `dist/` compilado y
sobre el sitio servido en local, no sobre el código fuente.

## Build

| Comando | Resultado |
|---|---|
| `npm run check` | 0 errores · 0 warnings · 0 hints (42 archivos) |
| `npm run build` | 9 páginas · sin errores |

Único warning: `[@astrojs/sitemap] No pages found!`. Esperado con
`SITE_IS_PUBLIC = false`.

## Enlaces y estructura

0 enlaces internos rotos · 0 anclas rotas (66 verificadas) · 0 enlaces
protocol-relative · 0 IDs duplicados · 0 assets locales faltantes.

Enlaces entrantes por ruta: mínimo 26. Ninguna ruta huérfana.

## Responsive

63 combinaciones (9 rutas × 375, 390, 430, 768, 1024, 1280, 1440).
**0 con overflow horizontal.**

## Accesibilidad

| Chequeo | Resultado |
|---|---|
| Orden de headings (sin saltos) | 9/9 |
| Un `<h1>` por página | 9/9 |
| Controles de formulario con label | todos |
| `alt` en imágenes | todas |
| Enlaces con nombre accesible | todos |
| Contraste, componentes nuevos | 49 muestras, mínimo 5.02:1 |

Contraste medido **componiendo el alfa** contra los fondos reales acumulados.
Sin eso, un color semitransparente mide como si flotara sobre negro puro y
da falsos negativos.

Estado que no depende solo del color: `COHERENTE` / `NO COINCIDE` / `FUGA` en
Message Match y `× sin conexión` en Connection Gap llevan el estado escrito.

### Navegación

Abre con click (no hover) · `aria-expanded` + `aria-controls` apuntando a un
elemento real · Escape cierra y devuelve el foco al trigger · click afuera
cierra · 6 enlaces tabulables.

Objetivos táctiles del header entre 32 y 39px de alto: cumplen WCAG 2.5.8 AA
(24px mínimo), no el 2.5.5 AAA de 44px. En mobile el nav supera los 44px.

### Reduced motion

Los componentes nuevos no traen animación propia: solo `data-reveal`, ya
neutralizado por el catch-all global.

## Formulario — intent routing

| Chequeo | Resultado |
|---|---|
| Preselección desde `?intent=` | OK, los 8 intents |
| Intent inválido | Rechazado, el select queda vacío |
| Intento de inyección en el intent | Sin efecto, siguen 10 opciones |
| UTMs junto al intent | Los 5 sobreviven |
| `referrer` y `landing_page` | Preservados |
| WhatsApp expone claves internas | No: viaja `Servicio: Growth Engineering` |

## Bundle

|  | Antes | Después | Delta |
|---|---|---|---|
| HTML (9 páginas) | 410,3 KB | 431,5 KB | +21,2 KB · +5,2% |
| HTML gzip | 80,5 KB | 85,4 KB | +4,9 KB · +6,1% |
| CSS | 50,2 KB | 50,2 KB | 0 |
| JS | 2,2 KB | 2,2 KB | 0 |

El CSS de los componentes nuevos viaja dentro del HTML: Astro lo inlinea con
`inlineStylesheets: 'auto'`. Sin dependencias nuevas y sin archivos nuevos.
