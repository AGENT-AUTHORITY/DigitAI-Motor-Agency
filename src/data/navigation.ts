/**
 * Navegacion — fuente unica para Header y Footer.
 *
 * En la V1 el nav estaba duplicado literalmente en los 6 HTML y el numero de
 * WhatsApp aparecia hardcodeado en 41 enlaces. Todo eso sale de aca.
 */

export interface NavLink {
  label: string;
  href: string;
  /** Descripcion corta para title/aria cuando el label solo no alcanza. */
  description?: string;
}

export interface NavGroup {
  title: string;
  links: NavLink[];
}

/** Numero de contacto. Un solo lugar. */
export const WHATSAPP_NUMBER = '5492226638044';

export const SITE = {
  name: 'digitAI motor',
  legalName: 'digitAI Motor',
  tagline: 'Performance · Conversion · Growth',
  locality: 'Cañuelas',
  region: 'Buenos Aires',
  country: 'Argentina',
  coverage: 'Remote across LATAM',
  email: 'hola@digitaimotor.lat',
} as const;

/** Nav principal. Orden = prioridad comercial, no alfabetico. */
export const MAIN_NAV: NavLink[] = [
  { label: 'Servicios', href: '/performance-marketing/' },
  { label: 'Soluciones', href: '/growth-engineering/' },
  { label: 'Casos', href: '/auditoria-performance/' },
  { label: 'Quick Fix', href: '/quick-fix/' },
  { label: 'Nosotros', href: '/nosotros/' },
];

export const NAV_CTA: NavLink = {
  label: 'Analizar mi negocio',
  href: '/contacto/',
};

export const FOOTER_NAV: NavGroup[] = [
  {
    title: 'Services',
    links: [
      { label: 'Performance Marketing', href: '/performance-marketing/' },
      { label: 'Google Ads', href: '/google-ads/' },
      { label: 'Meta Ads', href: '/meta-ads/' },
      { label: 'Landing Pages', href: '/landing-pages/' },
      { label: 'CRM & Automation', href: '/crm-automation/' },
      { label: 'Growth Engineering', href: '/growth-engineering/' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'Nosotros', href: '/nosotros/' },
      { label: 'Casos', href: '/auditoria-performance/' },
      { label: 'Quick Fix', href: '/quick-fix/' },
      { label: 'Contacto', href: '/contacto/' },
    ],
  },
  {
    // TODO(owner): faltan las URLs reales de los perfiles. No se inventan.
    // Footer descarta todo link con href vacio, asi que el grupo no se
    // renderiza hasta completarlas.
    title: 'Resources',
    links: [
      { label: 'LinkedIn', href: '' },
      { label: 'Instagram', href: '' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacidad', href: '/privacidad/' },
      { label: 'Cookies', href: '/cookies/' },
    ],
  },
];

/**
 * Construye un enlace de WhatsApp con contexto prellenado.
 * Los UTMs se adjuntan en FASE 7 desde la capa de analytics; aca solo se
 * arma la URL base para no dispersar el numero por el codigo.
 */
export function whatsappLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/** True si `href` corresponde a la ruta actual (tolera trailing slash). */
export function isActivePath(href: string, pathname: string): boolean {
  const norm = (p: string) => (p.endsWith('/') ? p : `${p}/`);
  return norm(href) === norm(pathname);
}
