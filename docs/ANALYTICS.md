# ANALYTICS — Arquitectura de medición

## Estado heredado

**La V1 no tiene analytics. Ninguno.**

Verificado: sin GA4, sin GTM, sin Meta Pixel, sin ningún tag.
Todos los CTAs (41 enlaces `wa.me`) salen a WhatsApp **sin medición**.

Consecuencia: cero datos sobre qué página, qué CTA o qué canal genera contacto.
Es, literalmente, el problema que la V2 vende resolver.

## Principio

**Sin ID configurado, sin script inyectado.** Nada de IDs placeholder ni
inventados en el código. Los IDs viven en variables de entorno `PUBLIC_*` y el
layout inyecta el tag solo si la variable existe y no está vacía.

## Variables

| Variable | Uso | Estado |
|---|---|---|
| `PUBLIC_GA4_ID` | GA4 measurement ID (`G-XXXXXXXXXX`) | pendiente |
| `PUBLIC_GTM_ID` | Google Tag Manager (`GTM-XXXXXXX`) | pendiente |
| `PUBLIC_META_PIXEL_ID` | Meta Pixel (numérico) | pendiente |
| `PUBLIC_GOOGLE_ADS_ID` | Google Ads (`AW-XXXXXXXXX`) | pendiente |
| `PUBLIC_GOOGLE_ADS_CONVERSION_LABEL_LEAD` | Label de conversión Lead | pendiente |
| `PUBLIC_FORM_ENDPOINT` | Endpoint del formulario | pendiente |

Plantilla en `.env.example`. `.env` está en `.gitignore`. Nunca commitear IDs reales.

## Eventos

Capa única en `src/utils/analytics.ts`. Los componentes nunca llaman `gtag`
o `fbq` directamente, solo `track(event, params)`.

| Evento | Disparo | Parámetros |
|---|---|---|
| `view_service` | Carga de página de servicio | `service_slug`, `page_path` |
| `click_primary_cta` | Click en CTA primario | `cta_label`, `section`, `page_path` |
| `click_whatsapp` | Click en cualquier enlace `wa.me` | `context`, `page_path` |
| `open_quick_fix` | Apertura del bloque Quick Fix | `entry_point` |
| `form_start` | Primer `focus` en un campo del form | `form_id` |
| `form_submit` | Submit válido | `form_id`, `service_interest` |
| `book_call` | Click en agendar llamada | `page_path` |
| `case_view` | Scroll 50% sobre el bloque de caso | `case_slug` |

## Conversiones Google Ads

| Tipo | Conversión | Contador | Nota |
|---|---|---|---|
| Primaria | Qualified Lead | Uno | Solo tras calificación en CRM. Requiere import offline. |
| Primaria | Booked Call | Uno | |
| Primaria | Contact Form | Uno | `form_submit` |
| Secundaria | WhatsApp Click | Uno | Proxy, no venta. No optimizar sobre esto. |
| Secundaria | Service View | Cada uno | Solo observación. |

IDs y labels: pendientes. No se implementan valores inventados.

## Conversiones Meta

| Evento | Disparo |
|---|---|
| `ViewContent` | Vista de service page |
| `Lead` | `form_submit` |
| `Contact` | `click_whatsapp` |
| `Schedule` | `book_call` |

**Pixel ahora. Conversions API después.**

CAPI requiere un event source con backend (endpoint server-side que reciba el
evento y lo reenvíe a Meta con `event_id` para deduplicar contra el Pixel).
El sitio es estático en GitHub Pages: no hay backend. Hasta que exista, la
web no afirma que CAPI esté configurado, solo lo describe como capacidad.

## UTMs

Helper en `src/utils/analytics.ts`: captura UTMs del query string en el primer
landing, los persiste en `sessionStorage` y los inyecta en los hidden fields
del formulario y en el texto prellenado de WhatsApp.

Parámetros preservados: `utm_source`, `utm_medium`, `utm_campaign`,
`utm_content`, `utm_term`, más `landing_page` y `referrer`.

### Convención de campañas

| Origen | Cadena |
|---|---|
| LinkedIn outbound | `utm_source=linkedin&utm_medium=outbound&utm_campaign=founder_prospecting` |
| LinkedIn orgánico | `utm_source=linkedin&utm_medium=organic&utm_campaign=content_growth` |
| Google Ads | auto-tagging con `gclid`, o `utm_source=google&utm_medium=cpc` |
| Meta Ads | `utm_source=meta&utm_medium=paid_social` |

## Checklist de activación (post-deploy)

- [ ] Crear propiedad GA4 y cargar `PUBLIC_GA4_ID`
- [ ] Crear contenedor GTM y cargar `PUBLIC_GTM_ID`
- [ ] Crear Pixel de Meta y cargar `PUBLIC_META_PIXEL_ID`
- [ ] Crear acciones de conversión en Google Ads y cargar ID + labels
- [ ] Verificar `form_submit` end-to-end con GA4 DebugView
- [ ] Verificar `click_whatsapp` con Meta Pixel Helper
- [ ] Marcar Qualified Lead / Booked Call / Contact Form como primarias
- [ ] Configurar endpoint del formulario y probar entrega
- [ ] Vincular GA4 con Google Ads y GA4 con Search Console

---

# FASE 5 — Arquitectura implementada

## Estado de los IDs

Buscados en `.env`, `.env.example`, todo el código y los HTML de la V1:

| ID | Estado |
|---|---|
| GA4 (`PUBLIC_GA4_ID`) | **MISSING** |
| Google Tag Manager | **MISSING** |
| Meta Pixel | **MISSING** |
| Google Ads | **MISSING** |
| Google Ads conversion label | **MISSING** |

No existe archivo `.env`. **El tracking queda deshabilitado**, y es el estado
correcto: sin ID no se inventa ninguno.

## Dónde vive ahora

| Archivo | Rol |
|---|---|
| `src/lib/analytics.ts` | Nombres de evento y la reserva de `generate_lead` |
| `src/components/Analytics.astro` | Único punto de inyección |

`BaseLayout` ya no contiene lógica de tracking: llama a `<Analytics />` y nada más.

**Con el tracking deshabilitado el sitio emite cero peticiones a terceros.**
Verificado en la traza: 8 peticiones en la home, todas al propio dominio.

`window.dmTrack(evento, payload)` se define siempre. Deshabilitado es un no-op,
así que quien lo llama no necesita saber si hay tracking activo.

## Modelo de eventos

Tres eventos. Pocos y con significado exacto.

| Evento | Cuándo | Qué significa |
|---|---|---|
| `service_intent_selected` | Llega con `?intent=` o cambia el select | Qué servicio le interesa |
| `contact_form_completed` | El formulario pasó validación | Los datos están completos |
| `whatsapp_handoff_started` | El sitio abrió WhatsApp | **El sitio preparó la conversación** |

### Por qué no hay `generate_lead`

El formulario no tiene backend. Al enviarlo se abre WhatsApp con el mensaje ya
escrito, pero **la persona todavía tiene que apretar enviar**, y desde el sitio
no hay forma de saber si lo hizo.

Contar eso como lead haría dos daños:

1. Infla la conversión en el reporte.
2. Peor: entrena a las plataformas hacia una señal falsa. Meta y Google
   optimizan hacia el evento que reciben. Si el evento miente, la campaña
   aprende a traer gente que abre WhatsApp y no escribe.

Es exactamente el problema que este sitio dice saber resolver. `generate_lead`
queda **reservado** en `src/lib/analytics.ts` para cuando exista backend,
webhook, alta en CRM o cualquier confirmación real de recepción.

## Decisión sobre el backend del formulario — V1

**No se construye backend para este lanzamiento.** El handoff por WhatsApp se
mantiene tal cual.

Motivo: el sitio ya puede captar conversaciones y no tiene sentido bloquear el
lanzamiento por infraestructura adicional.

**POST-LAUNCH PRIORITY:** captura server-side con alta en CRM. Cuando exista,
se habilita `generate_lead` y recién ahí hay una conversión real que contar.
