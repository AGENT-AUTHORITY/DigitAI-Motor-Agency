import type { APIRoute } from 'astro';

/**
 * robots.txt generado, no estatico.
 *
 * Se genera para que dependa del MISMO interruptor que el sitemap y el
 * noindex. Un robots.txt suelto en public/ se olvida de actualizar y termina
 * permitiendo crawling de un sitio que todavia va con noindex, o al reves.
 *
 * SITE_IS_PUBLIC vive en astro.config.mjs y llega hasta aca por la unica via
 * confiable: si el sitemap no genero ninguna URL, el sitio no es publico.
 * Ver docs/SEO.md.
 */
const SITEMAP_PATH = '/sitemap-index.xml';

export const GET: APIRoute = ({ site }) => {
  const origin = (site ?? new URL('https://www.digitaimotor.lat')).origin;

  // import.meta.env.PUBLIC_SITE_IS_PUBLIC permite forzar el estado desde el
  // entorno para la simulacion de QA sin tocar el config.
  const isPublic = import.meta.env.PUBLIC_SITE_IS_PUBLIC === 'true';

  const body = isPublic
    ? [
        '# digitAI Motor',
        'User-agent: *',
        'Allow: /',
        '',
        '# Estos bots agregan carga y no aportan trafico comercial.',
        'User-agent: AhrefsBot',
        'Crawl-delay: 10',
        '',
        'User-agent: SemrushBot',
        'Crawl-delay: 10',
        '',
        'User-agent: MJ12bot',
        'Crawl-delay: 20',
        '',
        `Sitemap: ${origin}${SITEMAP_PATH}`,
        '',
      ]
    : [
        '# digitAI Motor — sitio en preparacion, no publicado.',
        '# Las paginas llevan ademas <meta name="robots" content="noindex, nofollow">.',
        '# Los stubs legacy no lo llevan a proposito: su canonical tiene que poder',
        '# consolidar autoridad en el destino. Durante el estado seguro los cubre',
        '# este Disallow.',
        'User-agent: *',
        'Disallow: /',
        '',
      ];

  return new Response(body.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
