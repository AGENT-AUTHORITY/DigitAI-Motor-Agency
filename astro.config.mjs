// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
// Interruptor unico de publicacion. Ver site.config.mjs: de ese valor dependen
// el noindex, el sitemap y el robots.txt a la vez.
import { SITE_IS_PUBLIC } from './site.config.mjs';

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
    // Propaga el interruptor al codigo del sitio para que robots.txt y el
    // noindex lean exactamente el mismo valor que el sitemap.
    define: {
      'import.meta.env.PUBLIC_SITE_IS_PUBLIC': JSON.stringify(String(SITE_IS_PUBLIC)),
    },
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
      // Durante el checkpoint TODAS las páginas van con noindex, así que
      // ninguna debe entrar al sitemap: un sitemap que lista páginas noindex
      // es una contradicción que Search Console reporta. Poner esto en false
      // cuando se apruebe la publicación.
      filter: (page) =>
        SITE_IS_PUBLIC &&
        // Los redirects legacy nunca entran, ni siquiera publicado.
        !page.includes('/paginas-web') &&
        !page.includes('/crm-zoho') &&
        !page.includes('/automatizacion') &&
        !page.includes('/posicionamiento-geo') &&
        !page.includes('/funnel') &&
        !page.includes('/404'),
      changefreq: 'monthly',
      lastmod: new Date(),
    }),
  ],
});
