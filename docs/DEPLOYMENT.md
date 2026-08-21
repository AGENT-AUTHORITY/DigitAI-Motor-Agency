# DEPLOYMENT

## Situación actual (V1) — riesgo principal de la migración

El sitio se sirve desde **GitHub Pages, rama `main`, carpeta raíz**.
Los `.html` viven en la raíz del repo y Pages los publica tal cual.
No hay workflow de CI (`.github/` no existía).

Astro **no funciona así**: compila a `dist/`. Si se mergea la V2 a `main` sin
antes cambiar la configuración de Pages, Pages seguiría sirviendo los `.html`
viejos de la raíz, o serviría el repo Astro crudo (que no tiene `index.html`
en raíz) y el sitio caería.

### Cambio requerido en GitHub (acción manual del owner)

En `Settings > Pages > Build and deployment > Source`, cambiar
`Deploy from a branch` por `GitHub Actions`.

Es reversible volviendo a seleccionar la rama. Aun así, no se ejecuta sin
aprobación expresa.

## CNAME

`CNAME` contiene `www.digitaimotor.lat`. En un build de Astro el archivo debe
estar en `public/CNAME` para que termine en `dist/CNAME`. Ya copiado.

Si `CNAME` falta en el output, GitHub Pages descarta el dominio custom y el
sitio pasa a responder en `abraxasgroup.github.io`. Es el fallo más común de
esta migración y está cubierto por un check en el workflow.

## Workflow

`.github/workflows/deploy.yml`. Estado: **creado pero desactivado**
(`workflow_dispatch` únicamente, sin trigger en push). Se activa recién cuando
el owner lo apruebe.

Pasos: checkout, setup-node 22 con caché npm, `npm ci`, `npm run build`,
verificación de que `dist/CNAME` existe, upload artifact, deploy a Pages.

## Comandos

| Comando | Uso |
|---|---|
| `npm install` | Instalar dependencias |
| `npm run dev` | Servidor local en el puerto 4321 |
| `npm run build` | `astro check` mas build a `dist/` |
| `npm run build:fast` | Build sin type-check |
| `npm run preview` | Servir `dist/` local, con `--host` para probar desde el celular |

## Staging

GitHub Pages no da preview deployments. Dos opciones para revisión visual antes
del merge:

1. **Local (elegida para esta fase):** `npm run build` y luego `npm run preview`.
   Con `--host` la URL de red permite abrir el sitio desde un celular real,
   que es donde importa el QA de este proyecto.
2. **Vercel o Netlify preview:** conectar la rama `feature/growth-v2` a un
   proyecto de preview con dominio temporal. Requiere decisión del owner.
   No toca DNS del dominio de producción.

## Checklist de lanzamiento — FASE 5

Marcado contra el estado real del repositorio al cierre de FASE 5.
`[x]` significa verificado, no planificado.

### Listo

- [x] Rama final revisada — `feature/growth-v2`, `main` intacto
- [x] Página de privacidad — `/privacy/`, describe el comportamiento real
- [x] Página de almacenamiento — `/cookies/`, sin llamarle cookie a sessionStorage
- [x] Social card — `public/assets/og-default.png`, 1200×630, 57 KB
- [x] Favicon — `favicon.svg` + `favicon.ico` (16 / 32 / 48)
- [x] Apple touch icon — 180×180, sin esquinas redondeadas propias
- [x] Decisión de analítica — deshabilitada, sin ningún ID disponible
- [x] Decisión de consentimiento — sin banner, porque no hay nada que consentir
- [x] Página 404 — `/404.html` en la raíz de `dist`
- [x] Canonical — 12/12 con `https://www.`, una sola por página
- [x] Sitemap verificado en simulación pública — 11 URLs, sin 404 ni legacy
- [x] robots verificado en ambos estados
- [x] CNAME preservado — `dist/CNAME` = `www.digitaimotor.lat`
- [x] QA de laboratorio con Lighthouse — A11y 100, Best Practices 100
- [x] QA mobile — 63 combinaciones sin overflow, LCP 1172 ms, CLS 0.00
- [x] QA de formulario — 8 intents, acentos y caracteres especiales
- [x] Enlaces externos — solo LinkedIn, con `rel="noopener noreferrer"`

### Resuelto en FASE 5.1

- [x] Mapa de redirects legacy aprobado — `docs/REDIRECTS.md`
- [x] Stubs generados y validados — 5 URLs, 200, 0 recursos externos
- [x] `/posicionamiento-geo.html` decidido → `/quick-fix/`, con revisión post-launch
- [x] Quick Fix incorpora Google Business Profile / Maps

### Bloquea el lanzamiento — ninguno

- [x] **`PRIVACY_CONTROLLER_IDENTITY_MISSING`** — resuelto. Responsable y
      domicilio cargados en `src/data/navigation.ts`.
- [x] **`EMAIL_FORWARDING_UNVERIFIED`** — resuelto. El reenvío de
      `consultas@digitaimotor.lat` se probó con un envío externo y llegó al
      buzón interno sin rebotar.

Las guardas siguen activas: si alguien vacía un campo o vuelve
`forwardingVerified` a false, el build público falla otra vez. No es un estado
que se pueda perder por accidente.

### LAUNCH ACTIONS — no son blockers, se ejecutan el día del deploy

No requieren desarrollo. Se hacen en el momento, en este orden:

1. **Cambiar el origen de GitHub Pages** — Settings → Pages → Source →
   "GitHub Actions". Hasta que se haga, el workflow no publica nada.
   Al hacerlo, los HTML de la V1 en la raíz de la rama dejan de servirse: por
   eso los stubs tienen que estar en `dist/` antes.
2. Poner `DEFAULT_IS_PUBLIC = true` en `site.config.mjs`.
3. Merge a `main`.
4. Ejecutar el workflow.

### El día del lanzamiento, en este orden

- [ ] Poner `DEFAULT_IS_PUBLIC = true` en `site.config.mjs`
- [ ] `npm run build` y confirmar: 0 páginas con noindex salvo `/404.html`
- [ ] Confirmar sitemap con 11 URLs y `robots.txt` en modo público
- [ ] Confirmar que `dist/CNAME` sigue existiendo
- [ ] Merge a `main`
- [ ] Deploy
- [ ] Smoke test en producción: home, una service page, privacidad, un 404 real
- [ ] Comprobar la preview social pegando la URL en WhatsApp y LinkedIn
- [ ] Alta en Search Console y envío del sitemap
- [ ] Validación de analítica en producción — solo si para entonces hay ID y consentimiento resuelto

### Sobre el paso de GitHub Pages

El workflow publica **solo `dist/`**. Hoy Pages sirve desde la raíz de la rama,
que es donde viven los HTML de la V1. Al cambiar el origen a "GitHub Actions",
esos archivos dejan de servirse y **todas las URLs legacy pasan a 404** salvo
que existan stubs. Ver `docs/REDIRECTS.md`.

El workflow además falla a propósito si `dist/sitemap-index.xml` no existe, y
ese archivo solo se genera con el sitio en público. Es un seguro: **no se puede
deployar un sitio marcado como no publicado.**

## Rollback

`Settings > Pages > Source > Deploy from a branch > backup/pre-growth-v2 > (root)`

Restaura la V1 completa sin tocar git ni DNS.

### Interruptor único

`SITE_IS_PUBLIC` en `astro.config.mjs` controla el sitemap. Mientras sea
`false`, el sitemap sale vacío a propósito: un sitemap que lista páginas
`noindex` es una contradicción que Search Console reporta como error.

El `noindex` en sí vive en los layouts y se retira por separado — son dos
gestos distintos justamente para que ninguno se active por accidente.

## Rollback

Backup en la rama `backup/pre-growth-v2`, apuntando a `9dcda2e`, el estado
exacto de producción al inicio de la migración.

Para revertir: `Settings > Pages > Source > Deploy from a branch >
backup/pre-growth-v2 > (root)`.

Restaura la V1 completa sin tocar git ni DNS. Segundos, no minutos.

## Nunca

- No tocar DNS.
- No modificar el contenido de `CNAME`.
- No borrar `backup/pre-growth-v2`.
- No hacer force push a `main`.

---

# Email de contacto — arquitectura y puesta en marcha

## Lo que se busca

```
VISITANTE  →  consultas@digitaimotor.lat  →  reenvío  →  buzón interno
```

Públicamente el sitio muestra **`consultas@digitaimotor.lat`** y nada más.

El buzón que recibe de verdad es la casilla de Gmail de la agencia, configurada
como destino del forwarder en el panel de Namecheap. **La dirección literal no
se escribe en este repositorio.**

Motivo: no se pudo verificar si el repositorio es público. Si lo es, una
dirección escrita acá queda indexable y buscable en GitHub, que es exactamente
lo contrario de "buzón interno". Quien tenga acceso al panel la ve en la
configuración del forwarder, que es la fuente de verdad de todos modos.

Si el repositorio es privado y se prefiere tenerla anotada, se agrega acá con
una edición.

**Ese Gmail no está en `src/`.** Es configuración del registrador, no dato del
sitio. Dejarlo fuera del código hace imposible que se filtre al HTML por
descuido. `scripts/check-no-private-mailbox.cjs` verifica sobre `dist/` que ninguna
dirección de Gmail aparezca en ningún archivo — y está probado que detecta, no que pasa por vacío.

## Proveedor — verificado, no supuesto

Consultado por DNS el 20 de agosto de 2026:

| Registro | Valor | Qué significa |
|---|---|---|
| NS | `dns1.registrar-servers.com`, `dns2.registrar-servers.com` | DNS de **Namecheap** (BasicDNS) |
| MX | `eforward1` … `eforward5.registrar-servers.com` | **Email Forwarding gratuito de Namecheap, ya activo** |
| A (`www`) | 185.199.108–111.153 | GitHub Pages |

Los MX ya apuntan a la infraestructura de reenvío. **No hace falta tocar DNS,
ni contratar una casilla, ni Google Workspace.** Falta únicamente crear el alias
en el panel.

Lo que el DNS **no** puede confirmar es si el alias `consultas@` existe: eso no
se ve desde afuera. Por eso hace falta la prueba de envío.

## Pasos

En el panel de Namecheap, con la cuenta dueña del dominio:

1. **Domain List** → `digitaimotor.lat` → **Manage**
2. Pestaña **Domain**, sección de reenvío de correo (aparece como
   *Redirect Email* o *Email Forwarding*, según la versión del panel)
3. **Add Forwarder**
   - Alias: `consultas`
   - Destino: el buzón interno
4. Guardar y esperar la propagación

> Las etiquetas exactas del panel pueden cambiar con las versiones de la
> interfaz. Lo que no cambia es lo verificado por DNS: el reenvío es de
> Namecheap y ya está activo a nivel MX.

## Prueba obligatoria — `EMAIL_FORWARDING_UNVERIFIED`

Configurar el alias **no** cierra el blocker. Hay que comprobar recepción:

1. Enviar un mail **desde una cuenta externa** (no desde el propio Gmail —
   un envío a uno mismo puede resolverse sin pasar por el reenvío) a
   `consultas@digitaimotor.lat`
2. Confirmar que llega al buzón interno
3. Confirmar que **no rebota** y que no cayó en spam

Recién ahí, poner en `src/data/navigation.ts`:

```ts
CONTACT_EMAIL.forwardingVerified = true
```

Ese cambio hace tres cosas de una vez: el sitio pasa a mostrar
`consultas@digitaimotor.lat` en privacidad, almacenamiento y el formulario, y
el build público deja de fallar por este motivo.

## Por qué no se publica todavía

Mientras `forwardingVerified` sea `false`, el sitio sigue mostrando
`hola@digitaimotor.lat`, que es la dirección ya publicada en producción hoy.

Publicar `consultas@` antes de comprobarlo sería poner en una política de
privacidad un canal para ejercer derechos que quizás no recibe nada. Es
exactamente el error que la V1 cometió con `og-image.png`: declarar algo que no
existía.
