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

export const SITE = {
  name: 'digitAI motor',
  legalName: 'digitAI Motor',
  positioning: 'Growth Partner',
  descriptor: 'Performance · Creative · Conversion · Growth Systems',
  locality: 'Cañuelas',
  region: 'Buenos Aires',
  country: 'Argentina',
  coverage: 'Remote across LATAM',
  email: 'hola@digitaimotor.lat',
} as const;

/**
 * Anclas de la homepage. Mientras las service pages no existan, los CTA
 * apuntan aca en vez de a rutas inexistentes.
 */
export const ANCHORS = {
  growthAudit: '#growth-audit',
  quickFix: '#quick-fix',
  performanceCreative: '#performance-creative',
  capabilities: '#capabilities',
  evidence: '#evidence',
} as const;

/** Nav principal. Orden = prioridad comercial. */
export const MAIN_NAV: NavLink[] = [
  { label: 'Growth Audit', href: ANCHORS.growthAudit },
  { label: 'Performance Creative', href: ANCHORS.performanceCreative },
  { label: 'Capacidades', href: ANCHORS.capabilities },
  { label: 'Evidencia', href: ANCHORS.evidence },
  { label: 'Quick Fix', href: ANCHORS.quickFix },
];

export const NAV_CTA: NavLink = {
  label: 'Solicitar diagnóstico',
  href: ANCHORS.growthAudit,
};

export const FOOTER_NAV: NavGroup[] = [
  {
    title: 'Growth',
    links: [
      { label: 'Growth Audit', href: '/growth-audit/', pending: true },
      { label: 'Performance Creative', href: '/performance-creative/', pending: true },
      { label: 'Paid Media', href: '/paid-media/', pending: true },
      { label: 'CRO & Landing Pages', href: '/cro-landing-pages/', pending: true },
    ],
  },
  {
    title: 'Systems',
    links: [
      { label: 'Tracking & Analytics', href: '/tracking-analytics/', pending: true },
      { label: 'CRM & Automation', href: '/crm-automation/', pending: true },
      { label: 'Growth Engineering', href: '/growth-engineering/', pending: true },
      { label: 'Quick Fix', href: '/quick-fix/', pending: true },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about/', pending: true },
      { label: 'Work', href: '/work/', pending: true },
      { label: 'Contacto', href: ANCHORS.growthAudit },
      { label: 'LinkedIn', href: LINKEDIN_URL },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacidad', href: '/privacy/', pending: true },
      { label: 'Cookies', href: '/cookies/', pending: true },
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
