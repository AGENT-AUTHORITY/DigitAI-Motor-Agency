import type { APIRoute, GetStaticPaths } from 'astro';
import { LEGACY_ROUTES, renderLegacyStub } from '../data/legacy';

/**
 * Emite un stub por cada URL legacy, en su ruta exacta.
 *
 * El nombre del archivo lleva `.html` para que el output caiga en
 * `/crm-zoho.html` y no en `/crm-zoho/index.html`: las URLs viejas terminaban
 * en `.html` y hay que respetarlas tal cual.
 *
 * Ver src/data/legacy.ts para el mapa y el detalle de por que esto no es un
 * HTTP 301.
 */
export const getStaticPaths: GetStaticPaths = () =>
  LEGACY_ROUTES.map((route) => ({
    // El parametro va sin `.html`: la extension la aporta el nombre del archivo.
    params: { legacy: route.file.replace(/\.html$/, '') },
    props: { route },
  }));

export const GET: APIRoute = ({ props, site }) => {
  const origin = (site ?? new URL('https://www.digitaimotor.lat')).origin;
  const route = props.route as (typeof LEGACY_ROUTES)[number];

  return new Response(renderLegacyStub(route, origin), {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
};
