/**
 * Modelo de eventos de digitAI Motor.
 *
 * REGLA CENTRAL: no llamar "lead" a algo que todavia no lo es.
 *
 * El formulario no tiene backend. Al enviarlo, el sitio abre WhatsApp con el
 * mensaje precargado — pero la persona todavia tiene que apretar enviar en
 * WhatsApp, y no hay forma de saber desde el sitio si lo hizo. Contar eso como
 * conversion inflaria el numero y, peor, entrenaria a las plataformas hacia
 * una senal falsa.
 *
 * Por eso el evento se llama `whatsapp_handoff_started` y significa
 * exactamente "el sitio preparo la conversacion", nunca "lead confirmado".
 */
export const EVENTS = {
  /** La persona eligio (o llego con) una intencion de servicio. */
  SERVICE_INTENT_SELECTED: 'service_intent_selected',
  /** El formulario paso validacion con todos los campos requeridos. */
  CONTACT_FORM_COMPLETED: 'contact_form_completed',
  /** El sitio abrio o preparo la conversacion de WhatsApp. NO es un lead. */
  WHATSAPP_HANDOFF_STARTED: 'whatsapp_handoff_started',
} as const;

export type AnalyticsEvent = (typeof EVENTS)[keyof typeof EVENTS];

/**
 * RESERVADO — no usar todavia.
 *
 * `generate_lead` queda disponible para cuando exista evidencia real de
 * recepcion: backend propio, webhook, alta en CRM o confirmacion equivalente.
 * Mientras la unica entrega sea el handoff de WhatsApp, no hay nada que
 * confirme que el mensaje llego.
 *
 * Ver docs/ANALYTICS.md, seccion "Lead confirmado".
 */
export const RESERVED_LEAD_EVENT = 'generate_lead' as const;

/** Nombre de la funcion global que exponen los inline scripts. */
export const TRACK_FN = 'dmTrack';
