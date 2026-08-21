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
  /** Clic en un enlace directo a WhatsApp (footer, nav movil, recuperacion). */
  WHATSAPP_CLICK: 'whatsapp_click',
  /**
   * CONVERSION. El endpoint confirmo recepcion con 2xx.
   *
   * Este es el unico evento que significa "hay un lead". Se dispara despues de
   * la respuesta del POST, nunca en el submit ni en el handoff de WhatsApp.
   */
  LEAD_DELIVERED: 'generate_lead',
  /** El POST fallo. Sirve para enterarse de que la entrega se rompio. */
  LEAD_DELIVERY_FAILED: 'lead_delivery_failed',
} as const;

export type AnalyticsEvent = (typeof EVENTS)[keyof typeof EVENTS];

/**
 * `generate_lead` ya no esta reservado.
 *
 * La condicion que pedia este archivo —evidencia real de recepcion— existe
 * desde que el formulario entrega por `PUBLIC_FORM_ENDPOINT` y el evento se
 * dispara unicamente cuando la respuesta es 2xx. Sigue estando PROHIBIDO
 * dispararlo en el submit o en el handoff de WhatsApp: ninguno de los dos
 * confirma que el mensaje llego a ningun lado.
 *
 * Ver docs/ANALYTICS.md, seccion "Lead confirmado".
 */

/** Nombre de la funcion global que exponen los inline scripts. */
export const TRACK_FN = 'dmTrack';

/** Nombre de la funcion global que registra la decision de consentimiento. */
export const CONSENT_FN = 'dmConsent';

/**
 * Clave de localStorage con la decision. Valores: 'granted' | 'denied'.
 *
 * localStorage y no cookie: la decision es del navegador y no necesita viajar
 * al servidor. Un sitio estatico no tiene servidor que la lea.
 */
export const CONSENT_KEY = 'dm_consent';
