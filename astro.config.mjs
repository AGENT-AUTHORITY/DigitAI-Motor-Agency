// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

/**
 * digitAI Motor — Growth V2
 *
 * site: host canónico REAL de producción. El dominio no-www hace 301 -> www,
 * por eso el canónico debe ser www (la V1 declaraba no-www y todos sus
 * canonical apuntaban a una URL que redirige).
 *
 * trailingSlash 'always' + build.format 'directory' => /google-ads/ en vez de
 * /google-ads.html. Convención única para todo el sitio.
 */
export default defineConfig({
  site: 'https://www.digitaimotor.lat',
  trailingSlash: 'always',
  build: {
    format: 'directory',
    inlineStylesheets: 'auto',
  },
  compressHTML: true,
  vite: {
    css: {
      // PostCSS explicito y vacio. Sin esto Vite busca hacia arriba y
      // levanta un postcss.config.cjs global de la maquina, que exige
      // autoprefixer y rompe el build. El proyecto no usa PostCSS: los
      // pocos prefijos que hacen falta estan escritos a mano.
      postcss: {},
    },
  },
  prefetch: {
    prefetchAll: false,
    defaultStrategy: 'hover',
  },
  integrations: [
    sitemap({
      filter: (page) =>
        // Las páginas de redirect legacy no deben entrar al sitemap
        !page.includes('/paginas-web') &&
        !page.includes('/crm-zoho') &&
        !page.includes('/automatizacion') &&
        !page.includes('/posicionamiento-geo') &&
        !page.includes('/funnel'),
      changefreq: 'monthly',
      lastmod: new Date(),
    }),
  ],
});
