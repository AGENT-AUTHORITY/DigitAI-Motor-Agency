/**
 * Navegacion — fuente unica para Header y Footer.
 *
 * En la V1 el nav estaba duplicado en los 6 HTML y el numero de WhatsApp
 * aparecia hardcodeado en 41 enlaces. Todo eso sale de aca.
 *
 * `pending: true` marca una ruta que todavia no existe. Header y Footer la
 * renderizan como texto inerte, no como enlace: ningun CTA ni item de nav
 * puede apuntar a un 404. Se quita el flag al crear cada pagina.
 */

export interface NavLink {
  label: string;
  href: string;
  description?: string;
  /** La ruta aun no existe. Se renderiza sin <a>. */
  pending?: boolean;
}

export interface NavGroup {
  title: string;
  links: NavLink[];
}

export const WHATSAPP_NUMBER = '5492226638044';
export const LINKEDIN_URL = 'https://www.linkedin.com/in/oechinbott/';

/**
 * Mensaje con el que abre WhatsApp cuando la persona entra por un enlace
 * directo (footer, nav movil) y no por el formulario.
 *
 * Deliberadamente neutro: abre la conversacion sin ponerle palabras en la boca
 * ni declarar un problema que la persona todavia no describio. El formulario
 * arma su propio mensaje, con los datos ya cargados.
 */
export const WHATSAPP_DEFAULT_MESSAGE =
  'Hola, quiero consultar por un diagnóstico de crecimiento.';

/**
 * Canal de contacto publico.
 *
 * Arquitectura elegida:
 *
 *   VISITANTE -> consultas@digitaimotor.lat -> reenvio -> buzon interno
 *
 * El buzon que efectivamente recibe NO figura en este archivo ni en ninguna
 * parte de `src/`. Es infraestructura de DNS, no dato del sitio, y dejarlo
 * fuera del codigo hace imposible que se filtre al HTML por descuido. Vive en
 * docs/DEPLOYMENT.md.
 *
 * `forwardingVerified` NO se pone en true por haber configurado el alias:
 * se pone en true despues de mandar un mail de prueba desde una cuenta externa
 * y confirmar que llega sin rebotar. Configurado y funcionando no son lo mismo.
 *
 * Mientras sea false, el build publico falla.
 */
export const CONTACT_EMAIL = {
  /** Direccion publica. Es la unica que puede aparecer en el sitio. */
  public: 'consultas@digitaimotor.lat',
  /** true SOLO tras la prueba real de recepcion. Ver docs/DEPLOYMENT.md. */
  forwardingVerified: true,
  /** Direccion ya publicada hoy. Se muestra mientras el reenvio no este probado. */
  interim: 'hola@digitaimotor.lat',
} as const;

/** La direccion que se puede mostrar hoy sin publicar un buzon que no recibe. */
export function contactEmail(): string {
  return CONTACT_EMAIL.forwardingVerified ? CONTACT_EMAIL.public : CONTACT_EMAIL.interim;
}

/**
 * Identidad del responsable del tratamiento de datos.
 *
 * VACIO A PROPOSITO. Estos tres campos son el ultimo blocker de lanzamiento
 * (PRIVACY_CONTROLLER_IDENTITY_MISSING) y no se completan por inferencia:
 * un nombre sacado del git config o un domicilio deducido de la localidad
 * serian datos legales inventados.
 *
 * Mientras esten vacios:
 *   - /privacy/ dice solo lo que se puede afirmar, sin marcadores visibles
 *   - el build PUBLICO falla con un mensaje explicito
 *
 * Completar los tres y el sitio queda listo. No hay que tocar ningun otro
 * archivo: /privacy/ los consume desde aca.
 */
export const PRIVACY_CONTROLLER = {
  /** Persona humana o razon social real. Ej: 'Nombre Apellido' o 'Empresa S.R.L.' */
  responsibleName: 'Oscar Esteban Chinchilla Bottero',
  /** El domicilio que corresponde publicar. */
  responsibleAddress: 'Buenos Aires, Argentina',
} as const;

/**
 * True cuando el sitio se puede publicar desde el lado de privacidad:
 * responsable identificado, domicilio cargado y canal de contacto verificado.
 *
 * El email no se cuenta por "estar escrito" sino por RECIBIR: una direccion de
 * contacto que no llega a ningun buzon no sirve para ejercer derechos.
 */
export function hasPrivacyIdentity(): boolean {
  return (
    PRIVACY_CONTROLLER.responsibleName.trim().length > 0 &&
    PRIVACY_CONTROLLER.responsibleAddress.trim().length > 0 &&
    CONTACT_EMAIL.forwardingVerified
  );
}

export const SITE = {
  name: 'digitAI motor',
  legalName: 'digitAI Motor',
  positioning: 'Growth Partner',
  descriptor: 'Performance · Creative · Conversion · Growth Systems',
  locality: 'Cañuelas',
  region: 'Buenos Aires',
  country: 'Argentina',
  coverage: 'Remote across LATAM',
  /** Derivado de CONTACT_EMAIL. No escribir una direccion aca. */
  email: contactEmail(),
} as const;

/**
 * Anclas de la homepage. Mientras las service pages no existan, los CTA
 * apuntan aca en vez de a rutas inexistentes.
 */
export const ANCHORS = {
  growthAudit: '/#growth-audit',
  quickFix: '/#quick-fix',
  performanceCreative: '/#performance-creative',
  capabilities: '/#capabilities',
  evidence: '/#evidence',
} as const;

/**
 * Submenu de servicios. Growth Audit y Quick Fix NO aparecen aca: son las dos
 * puertas de entrada y viven en el primer nivel del nav. Repetirlas adentro
 * diluye la jerarquia y obliga al usuario a elegir dos veces lo mismo.
 */
export const SERVICES_MENU: NavGroup[] = [
  {
    title: 'Adquisición',
    links: [
      { label: 'Performance Creative', href: '/performance-creative/', description: 'Research, hooks y testing' },
      { label: 'Paid Media', href: '/paid-media/', description: 'Estrategia de adquisición' },
      { label: 'Google Ads', href: '/google-ads/', description: 'Intención declarada' },
      { label: 'Meta Ads', href: '/meta-ads/', description: 'Demanda que todavía no busca' },
    ],
  },
  {
    title: 'Conversión y sistemas',
    links: [
      { label: 'CRO & Landing Pages', href: '/cro-landing-pages/', description: 'Convertir la intención que llega' },
      { label: 'Growth Engineering', href: '/growth-engineering/', description: 'Construir lo que falta' },
    ],
  },
];

/**
 * Nav principal. Cuatro items y un CTA: Growth Audit es la puerta comercial y
 * Quick Fix la entrada acotada, asi que ambos van al primer nivel. El resto
 * vive dentro de Servicios.
 */
export const MAIN_NAV: NavLink[] = [
  { label: 'Growth Audit', href: '/growth-audit/' },
  { label: 'Quick Fix', href: '/quick-fix/' },
  { label: 'Evidencia', href: ANCHORS.evidence },
];


/**
 * Intenciones de servicio. La clave es el identificador estable (routing,
 * tracking, futuro backend); el valor es lo unico que ve una persona.
 *
 * El formulario vive solo en la home. Cada service page lo abre con su
 * intencion ya elegida via ?intent=, en vez de duplicar el formulario en
 * nueve paginas.
 */
export const SERVICE_INTENTS = {
  growth_audit: 'Growth Audit',
  performance_creative: 'Performance Creative',
  paid_media: 'Paid Media',
  google_ads: 'Google Ads',
  meta_ads: 'Meta Ads',
  cro: 'Conversion / CRO',
  growth_engineering: 'Growth Engineering',
  quick_fix: 'Quick Fix',
} as const;

export type ServiceIntent = keyof typeof SERVICE_INTENTS;

/** Opcion de salida cuando la persona todavia no sabe que necesita. */
export const INTENT_UNSURE = { key: 'unsure', label: 'No estoy seguro' } as const;

/**
 * Enlace al formulario de la home con la intencion preseleccionada.
 * El query va antes del fragmento para que el ancla siga funcionando.
 */
export function intentLink(intent: ServiceIntent): string {
  return `/?intent=${intent}#growth-audit`;
}

export const NAV_CTA: NavLink = {
  label: 'Solicitar diagnóstico',
  href: ANCHORS.growthAudit,
};

export const FOOTER_NAV: NavGroup[] = [
  {
    title: 'Servicios',
    links: [
      { label: 'Growth Audit', href: '/growth-audit/' },
      { label: 'Performance Creative', href: '/performance-creative/' },
      { label: 'Paid Media', href: '/paid-media/' },
      { label: 'Google Ads', href: '/google-ads/' },
    ],
  },
  {
    title: 'Sistemas',
    links: [
      { label: 'Meta Ads', href: '/meta-ads/' },
      { label: 'CRO & Landing Pages', href: '/cro-landing-pages/' },
      { label: 'Growth Engineering', href: '/growth-engineering/' },
      { label: 'Quick Fix', href: '/quick-fix/' },
    ],
  },
  {
    title: 'Contacto',
    links: [
      { label: 'Solicitar diagnóstico', href: ANCHORS.growthAudit },
      // Canal real de contacto de hoy. Estaba solo como consecuencia del
      // submit del formulario: quien queria escribir directamente no tenia
      // por donde. `whatsappLink` es una declaracion de funcion, asi que
      // esta hoisteada y se puede usar aca aunque se defina mas abajo.
      { label: 'WhatsApp', href: whatsappLink(WHATSAPP_DEFAULT_MESSAGE) },
      { label: 'LinkedIn', href: LINKEDIN_URL },
    ],
  },
  {
    // Solo en el footer. En el header competirian con la navegacion comercial
    // y no son paginas a las que alguien llega por decision propia.
    title: 'Legal',
    links: [
      { label: 'Privacidad', href: '/privacy/' },
      { label: 'Almacenamiento', href: '/cookies/' },
    ],
  },
];

/**
 * Enlace de WhatsApp con contexto prellenado. Canal secundario: nunca el
 * centro de la arquitectura de conversion.
 */
export function whatsappLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/** True si `href` corresponde a la ruta actual (tolera trailing slash). */
export function isActivePath(href: string, pathname: string): boolean {
  if (href.startsWith('#')) return false;
  const norm = (p: string) => (p.endsWith('/') ? p : `${p}/`);
  return norm(href) === norm(pathname);
}
