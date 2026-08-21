# ROUTES — Arquitectura de URLs

## Convención

- Host canónico: **`https://www.digitaimotor.lat`** (el no-www hace 301 a www).
- **Trailing slash obligatorio** (`trailingSlash: 'always'` + `build.format: 'directory'`).
- Sin extensión `.html` en URLs nuevas.
- Minúsculas, sin acentos, separadas por guion medio.

## Estado real de rutas

Refleja la arquitectura comercial pública: Growth Audit es la puerta principal
y Performance Creative es pilar, no sub-bullet de Paid Media.

Verificado sobre `dist/` al cierre de FASE 4 — no sobre esta tabla.

### BUILT — 9 rutas, todas con `noindex`

| Ruta | Rol comercial | Intent del formulario |
|---|---|---|
| `/` | Home · posicionamiento y evidencia | — |
| `/growth-audit/` | Entrada para problemas sistémicos o sin diagnosticar | `growth_audit` |
| `/performance-creative/` | Pilar diferencial · research, hooks y testing | `performance_creative` |
| `/paid-media/` | Hub de adquisición · decide canal, no ejecuta | `paid_media` |
| `/google-ads/` | Money page · intención declarada | `google_ads` |
| `/meta-ads/` | Money page · demanda que todavía no busca | `meta_ads` |
| `/cro-landing-pages/` | Money page · convertir la intención que llega | `cro` |
| `/growth-engineering/` | Construir la pieza que falta | `growth_engineering` |
| `/quick-fix/` | Entrada acotada para un problema concreto | `quick_fix` |

### FUTURE — en la arquitectura, sin fecha

| Ruta | Motivo de la espera |
|---|---|
| `/tracking-analytics/` | Hoy se cubre dentro de Growth Audit y Quick Fix |
| `/crm-automation/` | Hoy se cubre dentro de Growth Engineering |

### PRE-LAUNCH — bloquean la publicación

| Ruta | Motivo |
|---|---|
| `/privacy/` | Obligatoria antes de `SITE_IS_PUBLIC = true` |
| `/cookies/` | Obligatoria antes de `SITE_IS_PUBLIC = true` |
| `/404` | Falta página de error propia |

### NO PLANIFICADO en esta fase

| Ruta | Motivo |
|---|---|
| `/about/` | Sin material verificable que no sea el bloque Founder de la home |
| `/work/` | Requiere casos con permiso de publicación |
| `/contact/` | El formulario vive en la home; una ruta propia duplicaría la conversión |

### Reglas de enlazado

- Header, Footer y CTA **solo enlazan rutas BUILT**. Ninguna ruta FUTURE,
  PRE-LAUNCH ni NO PLANIFICADA aparece como enlace ni como texto inerte.
- Growth Audit y Quick Fix viven en el **primer nivel** del nav. No se repiten
  dentro del desplegable de Servicios.
- Los CTA de service page abren el formulario de la home con su intención ya
  elegida: `/?intent=<clave>#growth-audit` (ver `intentLink()` en
  `src/data/navigation.ts`).

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

## Enlaces de la home

Las nueve rutas existen, así que ya no hay destinos provisionales por página
faltante. Queda una decisión abierta:

Los CTA del cuerpo de la home siguen apuntando a **anclas de la propia home**
(`/#growth-audit`, `/#quick-fix`) y no a `/growth-audit/` ni a `/quick-fix/`.
No está roto — el ancla existe y el scroll funciona — pero significa que la
home no enlaza contextualmente a ninguna service page: las alcanza solo por el
nav y el footer.

La home quedó **congelada** en FASE 4, así que el cambio no se aplicó. Es la
primera decisión a tomar en la fase siguiente.

## Internal linking — verificado sobre `dist/`

**Hub → spokes:** `/paid-media/` enlaza a `/google-ads/` y `/meta-ads/`.

**Spokes → hub:** `/google-ads/` y `/meta-ads/` vuelven por breadcrumb a
`/paid-media/`.

**Cross-links contextuales** (enlaces dentro del cuerpo, no bloques de
"servicios relacionados" genéricos):

| Origen | Destino | Motivo del enlace |
|---|---|---|
| `/growth-audit/` | Paid Media · Performance Creative · CRO · Growth Engineering | Dónde suele terminar el diagnóstico |
| `/google-ads/` | `/cro-landing-pages/` | La intención puede ser buena y perderse después del clic |
| `/meta-ads/` | `/performance-creative/` · `/growth-engineering/` | Creative como palanca; atribución como infraestructura |
| `/performance-creative/` | `/meta-ads/` · `/cro-landing-pages/` | Del ángulo al canal y del mensaje a la página |
| `/cro-landing-pages/` | `/growth-engineering/` | Cuando el cuello de botella necesita infraestructura |
| `/quick-fix/` | `/growth-audit/` | El síntoma se repite: no era puntual |
| `/growth-engineering/` | `/growth-audit/` | Confirmar que el cuello de botella es técnico antes de construir |

**Regla:** ninguna money page huérfana, mínimo 2 enlaces internos entrantes.
Verificado: el mínimo real es 26.

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

---

# FASE 5 — Rutas añadidas

`/privacy/`, `/cookies/` y `/404` pasan de PRE-LAUNCH a **BUILT**.

| Ruta | Rol | En sitemap público |
|---|---|---|
| `/privacy/` | Política de privacidad | Sí |
| `/cookies/` | Almacenamiento del navegador | Sí |
| `/404` | Error, se emite como `/404.html` | **No** |

Total: **12 páginas**, 11 en el sitemap público.

Ambas legales se enlazan **solo desde el footer**, en un grupo "Legal". En el
header competirían con la navegación comercial y nadie llega a ellas por
decisión propia.

## Interruptor único de publicación

`site.config.mjs` es la única fuente. De ese valor dependen a la vez:

- el `noindex` de cada página (`BaseLayout`)
- qué URLs entran al sitemap (`astro.config.mjs`)
- si `robots.txt` permite o bloquea el crawling

**Antes estaban separados.** El `noindex` se escribía a mano página por página,
así que poner el sitemap en público habría dejado 11 páginas con `noindex` y un
sitemap listándolas — una contradicción que Search Console reporta. Ya no puede
pasar: es imposible desincronizarlos.

Para simular publicación sin tocar el archivo:
`PUBLIC_SITE_IS_PUBLIC=true npm run build`.

## Decisión sobre los CTA de la home — cerrada

Los CTA del cuerpo de la home siguen apuntando a anclas de la propia home
(`/#growth-audit`, `/#quick-fix`) y **no** a `/growth-audit/` ni `/quick-fix/`.

Decisión del owner en FASE 5: **no se cambian.** Menor fricción de conversión —
el formulario está en la misma página, sin navegación intermedia. Las service
pages se alcanzan por el nav, el footer y el enlazado interno.

Queda cerrada. No volver a abrirla en fases siguientes.

---

# FASE 5.1 — Stubs legacy

Cinco URLs de la V1 emiten un stub en su ruta exacta. No entran al sitemap ni
publicado el sitio.

| URL legacy | Destino |
|---|---|
| `/crm-zoho.html` | `/growth-engineering/` |
| `/automatizacion.html` | `/growth-engineering/` |
| `/paginas-web.html` | `/cro-landing-pages/` |
| `/funnel.html` | `/growth-engineering/` |
| `/posicionamiento-geo.html` | `/quick-fix/` |

`/index.html` **no lleva stub**: en el build nuevo ese archivo es la home, y
GitHub Pages la sirve igual en `/` y en `/index.html`. Un stub la sobrescribiría.

Fuente única en `src/data/legacy.ts`, emisión en `src/pages/[legacy].html.ts`.
Detalle y salvedades en `docs/REDIRECTS.md`.
