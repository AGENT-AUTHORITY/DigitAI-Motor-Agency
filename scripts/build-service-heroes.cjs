/**
 * Deriva los heroes de service page a WebP.
 *
 *   node scripts/build-service-heroes.cjs
 *
 * Los PNG originales NO se tocan ni se renombran: quedan como fuente en
 * assets-source/service-heroes/. Este script solo agrega los derivados que
 * consume el sitio, que son los unicos que van a public/.
 *
 * Los originales viven FUERA de public/ a proposito. Astro copia public/ tal
 * cual al build, asi que tenerlos ahi publicaba 9,6 MB de PNG que ningun
 * documento referencia — un 29% del sitio desplegado en archivos que nadie
 * pide. Son fuente de este script, no assets del sitio.
 *
 * Dos motivos para derivar:
 *
 * 1. PESO. Los originales pesan entre 1,3 y 1,5 MB cada uno. Son renders 3D
 *    sobre fondo oscuro — PNG es el formato equivocado para eso. En WebP
 *    bajan un orden de magnitud sin diferencia visible, y hablamos de la
 *    imagen LCP de cada pagina.
 *
 * 2. NOMBRES. Los originales llegaron con nombres inconsistentes, uno de
 *    ellos con espacios y parentesis ("Growth- Engineering-hero (2).png").
 *    En una URL eso obliga a percent-encoding y se rompe facil. Los derivados
 *    usan el nombre de la ruta que sirven, sin renombrar el original.
 */
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const dirFuente = path.join(__dirname, '..', 'assets-source', 'service-heroes');
const dirSalida = path.join(__dirname, '..', 'public', 'assets', 'service-heroes');

// origen (tal cual llego) -> derivado (nombre de la ruta que sirve)
const MAPA = [
  ['google-ads.png', 'google-ads.webp'],
  ['paid.media.png', 'paid-media.webp'],
  ['Meta-ads.png', 'meta-ads.webp'],
  ['cro-landing.png', 'cro-landing.webp'],
  ['Growth- Engineering-hero (2).png', 'growth-engineering.webp'],
  ['cta.png', 'cta.webp'],
  // Reserva: Performance Creative conserva el hero animado de la burbuja.
  ['performance-creative.png', 'performance-creative.webp'],
];

(async () => {
  let antes = 0, despues = 0;
  for (const [origen, derivado] of MAPA) {
    const src = path.join(dirFuente, origen);
    if (!fs.existsSync(src)) {
      console.error(`  FALTA  ${origen}`);
      process.exitCode = 1;
      continue;
    }
    const out = path.join(dirSalida, derivado);
    await sharp(src)
      // Sin resize: 1672px de ancho cubre 2x sobre los ~810px que ocupa el
      // visual en desktop. Reducir mas degradaria en pantallas retina.
      .webp({ quality: 82, effort: 6 })
      .toFile(out);

    const a = fs.statSync(src).size, d = fs.statSync(out).size;
    antes += a; despues += d;
    console.log(
      `  ${derivado.padEnd(28)} ${(a/1024).toFixed(0).padStart(6)} KB -> ${(d/1024).toFixed(0).padStart(5)} KB  (${Math.round((1-d/a)*100)}% menos)`
    );
  }
  console.log(`  ${'-'.repeat(62)}`);
  console.log(`  ${'TOTAL'.padEnd(28)} ${(antes/1024/1024).toFixed(1).padStart(5)} MB -> ${(despues/1024).toFixed(0).padStart(5)} KB`);
})();
