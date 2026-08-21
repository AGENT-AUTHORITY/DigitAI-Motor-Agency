/**
 * Mapa de URLs legacy de la V1.
 *
 * Los HTML de la V1 viven en la raiz del repositorio y hoy GitHub Pages los
 * sirve porque publica desde la rama. El workflow de deploy publica solo
 * `dist/`, asi que sin estos stubs las URLs viejas pasarian a 404 el dia del
 * cambio de origen.
 *
 * `/index.html` NO esta en esta lista, y es deliberado: en el build nuevo ese
 * archivo ES la home. GitHub Pages lo sirve igual en `/` y en `/index.html`,
 * asi que el mapeo hacia `/` ya se cumple solo. Un stub ahi sobrescribiria la
 * home.
 */
export interface LegacyRoute {
  /** Nombre exacto del archivo legacy, tal como se publicaba. */
  file: string;
  /** Ruta destino en la V2, con trailing slash. */
  to: string;
  /** Nombre del destino, para el enlace visible. */
  toLabel: string;
  /** Una linea neutra sobre que pasó con ese servicio. */
  message: string;
}

export const LEGACY_ROUTES: LegacyRoute[] = [
  {
    file: 'crm-zoho.html',
    to: '/growth-engineering/',
    toLabel: 'Growth Engineering',
    message: 'El desarrollo de CRM a medida ahora forma parte de Growth Engineering.',
  },
  {
    file: 'automatizacion.html',
    to: '/growth-engineering/',
    toLabel: 'Growth Engineering',
    message: 'La automatización de procesos comerciales ahora forma parte de Growth Engineering.',
  },
  {
    file: 'paginas-web.html',
    to: '/cro-landing-pages/',
    toLabel: 'CRO & Landing Pages',
    message: 'El desarrollo de páginas ahora forma parte de CRO & Landing Pages.',
  },
  {
    file: 'funnel.html',
    to: '/growth-engineering/',
    toLabel: 'Growth Engineering',
    message: 'Ese paquete ya no se ofrece. Lo que resolvía — WhatsApp, seguimiento, CRM y automatización — ahora forma parte de Growth Engineering.',
  },
  {
    file: 'posicionamiento-geo.html',
    to: '/quick-fix/',
    toLabel: 'Quick Fix',
    message: 'Google Business Profile y Maps ahora se resuelven como intervención puntual dentro de Quick Fix.',
  },
];

/**
 * HTML del stub.
 *
 * IMPORTANTE: esto NO es un HTTP 301. GitHub Pages responde 200 con este
 * documento. Google trata un meta refresh instantaneo como redirect
 * permanente, pero es un comportamiento de crawler, no del protocolo: no se
 * puede asumir que los demas hagan lo mismo.
 *
 * SIN meta robots a proposito. Un noindex junto a rel=canonical son señales
 * contradictorias — una pide no indexar y la otra pide consolidar autoridad en
 * el destino — y Google puede llegar a propagar el noindex hacia la pagina
 * canonica. El stub existe para transferir autoridad, asi que manda el
 * canonical solo.
 *
 * En estado seguro no hace falta compensarlo: robots.txt sale con
 * "Disallow: /" y bloquea el crawling de todo el sitio.
 *
 * Sin assets de la V1, sin CDN, sin fuentes externas: los estilos van inline y
 * son minimos. La pagina existe para reenviar, no para leerse.
 */
export function renderLegacyStub(route: LegacyRoute, origin: string): string {
  const target = origin + route.to;

  return `<!doctype html>
<html lang="es-AR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Contenido movido — digitAI Motor</title>
<meta http-equiv="refresh" content="0; url=${route.to}">
<link rel="canonical" href="${target}">
<link rel="icon" type="image/svg+xml" href="/assets/favicon.svg">
<style>
  :root { color-scheme: dark }
  * { margin: 0; padding: 0; box-sizing: border-box }
  body {
    min-height: 100vh;
    display: grid;
    place-items: center;
    padding: 2rem;
    background: #05070B;
    color: #F4F8FF;
    font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
    line-height: 1.6;
    text-align: center;
  }
  main { max-width: 34rem }
  p { color: #9CA9BA; margin-bottom: 1.75rem }
  a {
    display: inline-block;
    padding: 0.75rem 1.25rem;
    color: #05070B;
    background: #2388FF;
    border-radius: 8px;
    font-weight: 700;
    text-decoration: none;
  }
  a:hover, a:focus-visible { background: #459BFF }
</style>
</head>
<body>
  <main>
    <p>${route.message}</p>
    <a href="${route.to}">Continuar a ${route.toLabel}</a>
  </main>
  <script>
    // replace y no href: no deja la URL vieja en el historial, asi el boton
    // de volver no devuelve a este stub.
    location.replace(${JSON.stringify(route.to)});
  </script>
</body>
</html>
`;
}
