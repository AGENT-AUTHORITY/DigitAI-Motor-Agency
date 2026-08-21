/**
 * INTERRUPTOR ÚNICO DE PUBLICACIÓN.
 *
 * De este valor dependen, todos a la vez:
 *   - el `noindex` de cada página (BaseLayout)
 *   - qué URLs entran al sitemap (astro.config.mjs)
 *   - si robots.txt permite o bloquea el crawling (src/pages/robots.txt.ts)
 *
 * Estaban separados: `noindex` se escribía a mano página por página, así que
 * poner el sitemap en público habría dejado 11 páginas con noindex y un
 * sitemap listándolas. Ahora es imposible que se desincronicen.
 *
 * La variable de entorno existe solo para la simulación de QA
 * (`PUBLIC_SITE_IS_PUBLIC=true npm run build`). Sin ella manda el valor de
 * abajo, que es el estado real del proyecto.
 */
const DEFAULT_IS_PUBLIC = false;

export const SITE_IS_PUBLIC =
  process.env.PUBLIC_SITE_IS_PUBLIC !== undefined
    ? process.env.PUBLIC_SITE_IS_PUBLIC === 'true'
    : DEFAULT_IS_PUBLIC;
