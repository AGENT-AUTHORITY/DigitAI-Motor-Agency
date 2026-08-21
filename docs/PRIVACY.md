# PRIVACY — Decisiones y lo que falta

Documento interno. La página pública es `/privacy/`.

## Principio

La página describe **solo lo que el código hace**, verificado. Nada de
plantillas con cláusulas sobre cookies de terceros, transferencias
internacionales o encargados de tratamiento que en este sitio no existen.

## Lo que se verificó antes de escribirla

| Afirmación de la página | Cómo se comprobó |
|---|---|
| No hay cookies | `grep document.cookie` en `src/` → 0 resultados |
| Solo sessionStorage con 5 claves UTM | Única escritura: `ContactIntent.astro` |
| Sin terceros cargados | 8 peticiones de red en la home, todas al propio dominio |
| Sin analítica | Sin `.env`, sin ningún ID en el repo, `Analytics.astro` no emite nada |
| Fuentes propias | `public/fonts/`, sin Google Fonts |
| El formulario no envía a ningún servidor | No hay endpoint; se arma un enlace `wa.me` |

## Terceros reales

Tres, y ninguno carga script en la página:

1. **WhatsApp (Meta Platforms)** — solo si la persona continúa por ese canal.
2. **GitHub Pages** — hosting. Procesa la petición HTTP como cualquier servidor.
3. **LinkedIn** — únicamente como destino de un enlace. Sin widget ni píxel.

## LAUNCH BLOCKER — `PRIVACY_CONTROLLER_IDENTITY_MISSING`

**RESUELTO.** Se conserva documentado porque la guarda del build sigue activa:
si alguien vacía cualquiera de los tres campos, el build público vuelve a fallar.

La página identifica al responsable como **digitAI Motor**, con actividad en
Cañuelas, Buenos Aires, y una dirección de contacto. Eso es todo lo que existe
como dato verificable en el repositorio.

### Qué hace falta

| Campo | Qué es | Estado |
|---|---|---|
| `responsibleName` | Persona humana o razón social real | **CARGADO** |
| `responsibleAddress` | Domicilio a publicar | **CARGADO** |
| `CONTACT_EMAIL.forwardingVerified` | Que `consultas@digitaimotor.lat` reciba de verdad | **VERIFICADO** — prueba de envío externa, llegó sin rebotar |

### Qué NO hace falta necesariamente

**El CUIT no se trata como requisito obligatorio de publicación.** Puede
corresponder o no según la figura fiscal y el criterio del asesor. No se asume,
no se inventa, y no bloquea por sí solo.

Si un contador o abogado determina que debe publicarse, se agrega entonces.

### Cómo se completa

Los tres campos viven en `PRIVACY_CONTROLLER`, en `src/data/navigation.ts`.
`/privacy/` y `/cookies/` los consumen desde ahí: no hay que tocar ningún otro
archivo y no pueden desincronizarse.

### La guarda de lanzamiento

**El build público falla si los tres campos están vacíos.**
`src/pages/privacy.astro` lanza `PRIVACY_CONTROLLER_IDENTITY_MISSING` cuando
`SITE_IS_PUBLIC` es true y falta identidad. Verificado: con los campos vacíos,
`PUBLIC_SITE_IS_PUBLIC=true npm run build` termina con exit code 1.

Deja de ser un blocker que hay que recordar: es imposible publicar sin resolverlo.

En estado seguro no interfiere — se sigue trabajando con normalidad.

### Estado de la página

`/privacy/` está **técnicamente preparada** para recibir esos datos: el bloque
"Quién trata tus datos" se arma desde `SITE` en `src/data/navigation.ts`.
Completar los campos ahí es todo lo que hace falta.

**No hay ningún placeholder visible en producción.** La página no muestra
"[COMPLETAR]" ni nada equivalente: dice lo que se puede afirmar hoy y no
menciona lo que falta. Es honesta, aunque puede estar legalmente incompleta.

## Consentimiento

Hoy **no hay banner, y es la decisión correcta**: no existe ninguna tecnología
no esencial que consentir. Un banner sin nada detrás es decorado que además
entrena a la gente a aceptar sin leer.

`Analytics.astro` no emite ningún script mientras no haya ID. Si algún día se
configura uno:

1. Decidir el marco de consentimiento aplicable.
2. Implementarlo de modo que **nada cargue antes** de la aceptación.
3. Actualizar `/privacy/` y `/cookies/`.
4. Recién entonces desplegar el ID.

El orden importa: primero el consentimiento, después el tag.

## Retención

Las conversaciones viven en la casilla de correo o en el WhatsApp del negocio.
No hay base de datos propia, así que no hay un plazo de retención técnico que
declarar. La página lo dice así, sin inventar un número de meses.
