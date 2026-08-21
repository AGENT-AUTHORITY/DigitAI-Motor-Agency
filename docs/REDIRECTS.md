# REDIRECTS — Legacy V1 → Growth V2

> **Estado: MAPA APROBADO Y STUBS GENERADOS.**
> Fuente única: `src/data/legacy.ts`. Emisión: `src/pages/[legacy].html.ts`.

## Por qué hacen falta

Los HTML de la V1 viven en la **raíz del repositorio**. Hoy GitHub Pages los
sirve porque publica desde la rama.

El workflow de deploy publica **solo `dist/`**. El día que se cambie el origen
a "GitHub Actions", esos archivos dejan de servirse: sin stubs, todas las URLs
viejas pasan a 404 de golpe.

## Qué se puede hacer realmente con este hosting

GitHub Pages **no puede emitir un HTTP 301**. No hay `.htaccess`, ni
`_redirects`, ni `vercel.json`, ni reglas de edge. Verificado: ninguno existe.

| Opción | Qué es | Viable ahora |
|---|---|---|
| **Stub HTML** con meta refresh + canonical | Página 200 que reenvía. **No es un 301** | Sí |
| CDN o proxy delante | 301 real en el borde | Requiere cambiar DNS |
| Migrar hosting | 301 real | Requiere cambiar hosting |

### Sobre el meta refresh, sin exagerar

Google documenta que trata un meta refresh **instantáneo** (`content="0"`) como
redirect permanente y consolida las señales en el destino. Eso es cierto **para
Google**.

Lo que no hay que decir:

- **No es un HTTP 301.** El servidor responde 200 con un documento.
- Es comportamiento de un crawler, no del protocolo. Otros buscadores y las
  herramientas de análisis de enlaces no garantizan lo mismo.

En esta documentación se le dice **stub**, nunca "301".

## Mapa aprobado

| URL legacy | Qué era realmente | Destino |
|---|---|---|
| `/crm-zoho.html` | "Tu CRM, a la medida de tu negocio" | `/growth-engineering/` |
| `/automatizacion.html` | "Automatizá tu pipeline" — automatización de ventas | `/growth-engineering/` |
| `/paginas-web.html` | "Tu página web profesional en 5 días" | `/cro-landing-pages/` |
| `/funnel.html` | Pack: bot de WhatsApp + seguimiento + CRM + automatización | `/growth-engineering/` |
| `/posicionamiento-geo.html` | Google Maps / Google Business Profile | `/quick-fix/` |

### `/index.html` — no lleva stub, y es correcto

En el build nuevo **ese archivo es la home**: GitHub Pages sirve `dist/index.html`
tanto en `/` como en `/index.html`. El mapeo hacia `/` ya se cumple solo.

Generar un stub ahí **sobrescribiría la home**. Por eso `/index.html` no está en
`src/data/legacy.ts`.

## Qué lleva cada stub

1. `<meta http-equiv="refresh" content="0; url=/destino/">`
2. `<link rel="canonical" href="https://www.digitaimotor.lat/destino/">`
3. `location.replace('/destino/')` — `replace` y no `href`, para no dejar la
   URL vieja en el historial
4. Un `<a>` visible al destino, para JS deshabilitado y para el crawler

Sin branding de la V1, sin precios, sin scripts externos. **Cero recursos
descargados**: los estilos van inline y la única URL absoluta de cada stub es su
propio canonical. 1,5 KB cada uno, 7,4 KB en total.

### Sin `<meta name="robots">`, a propósito

Los stubs **no llevan `noindex`**. La señal que tienen que emitir es una sola y
coherente:

```
URL VIEJA  →  META REFRESH INSTANTÁNEO  →  CANONICAL AL DESTINO
```

Un `noindex` junto a `rel=canonical` son señales contradictorias: una pide no
indexar y la otra pide consolidar la autoridad en el destino. Google desaconseja
combinarlas y en algunos casos puede propagar el `noindex` hacia la página
canónica — que acá serían `/growth-engineering/`, `/cro-landing-pages/` y
`/quick-fix/`, todas comerciales.

El stub existe para **transferir autoridad**, no para pedir que lo ignoren.

**Durante el estado seguro no hace falta compensarlo.** Con
`DEFAULT_IS_PUBLIC = false`, `robots.txt` sale con `Disallow: /` y bloquea el
crawling de todo el sitio, stubs incluidos. No se agrega lógica para cambiar el
`robots` de los stubs según el entorno: sería una segunda fuente de verdad para
algo que el interruptor ya resuelve.

## Deuda futura — redirects HTTP reales

Mientras el hosting sea GitHub Pages, esto es lo mejor disponible. Si en algún
momento se migra a una infraestructura con redirects de servidor — Cloudflare
delante, Netlify, Vercel, o cualquier hosting con reglas propias —
**reemplazar los stubs por 301 o 308 reales** y borrar
`src/pages/[legacy].html.ts` junto con `src/data/legacy.ts`.

Un 301 es más rápido para la persona (no descarga un documento intermedio), no
depende de que el crawler interprete un meta refresh, y lo respetan todos los
buscadores por igual, no solo Google.

## `/posicionamiento-geo.html` — decisión tomada sin datos

**No hay export de Search Console disponible** para evaluar el histórico de esa
URL. La V1 nunca tuvo analytics instalado y no hay ningún dato de tráfico en el
repositorio. Verificado.

La decisión de mandarla a `/quick-fix/` se toma por cuatro razones, ninguna de
ellas de tráfico:

1. El contenido legacy es incompatible con la V2 — identidad visual vieja,
   precios públicos, canonical no-www y structured data con `offers`. No
   queremos que reaparezca dentro de la V2.
2. Existe una capability semánticamente relacionada: Quick Fix incorporó
   **Google Business Profile / Maps** como intervención puntual.
3. Dejarla caer en 404 tiene más riesgo que redirigirla.
4. Con este hosting no hay forma de hacer un 301 real, así que la opción
   "preservar con redirect limpio" no existe.

**REVISAR POST-LAUNCH EN SEARCH CONSOLE.** Si aparece tráfico histórico
relevante hacia esa URL, reconsiderar: puede justificar una página propia
reencuadrada en vez de un stub.

## QA posterior al deploy

- [ ] Las 5 URLs legacy responden 200 y llegan al destino en menos de 100 ms
- [ ] El canonical de cada stub apunta al destino con www y trailing slash
- [ ] `/index.html` sigue mostrando la home, no un stub
- [ ] Ninguna URL legacy aparece en el sitemap
- [ ] Search Console → Inspección de URL sobre cada legacy
- [ ] Sin aumento de 404 en Cobertura durante las dos semanas siguientes
- [ ] **Rendimiento → Páginas de `/posicionamiento-geo.html`**, últimos 12 meses
