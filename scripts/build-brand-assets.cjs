/**
 * Regenera la social card y los iconos desde sus fuentes.
 *
 *   node scripts/build-brand-assets.cjs           # solo iconos
 *   node scripts/build-brand-assets.cjs --og      # tambien la social card
 *
 * sharp ya viene con el toolchain de Astro: no se instalo nada para esto.
 *
 * La social card NO se rasteriza con sharp. sharp no resuelve @font-face, asi
 * que el texto saldria con una tipografia del sistema en vez de Manrope. Se
 * renderiza en Chrome a 2400x1260 y se baja a 1200x630 con lanczos, que ademas
 * deja el texto mas limpio que rasterizar directo a 1x.
 *
 * Para regenerar la card:
 *   1. npm run build && npm run preview
 *   2. copiar assets-source/og-default.html a dist/ y apuntar las fuentes a /fonts/
 *   3. capturar el viewport a 1200x630 con deviceScaleFactor 2
 *   4. guardar en qa-screens/og-preview-2x.png
 *   5. node scripts/build-brand-assets.cjs --og
 */
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const p = (...s) => path.join(root, ...s);

const png = (svg, size) =>
  sharp(svg, { density: 384 })
    .resize(size, size, { fit: 'contain' })
    .png({ compressionLevel: 9, effort: 10 })
    .toBuffer();

/**
 * Empaqueta PNGs en un contenedor ICO. El formato admite PNG embebido desde
 * Vista, asi que no hace falta BMP ni mascara AND. Se escribe a mano para no
 * sumar una dependencia solo por esto.
 */
const buildIco = (images) => {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);

  const dir = Buffer.alloc(16 * images.length);
  let offset = 6 + 16 * images.length;
  images.forEach(({ size, data }, i) => {
    const b = i * 16;
    dir.writeUInt8(size, b);
    dir.writeUInt8(size, b + 1);
    dir.writeUInt16LE(1, b + 4);
    dir.writeUInt16LE(32, b + 6);
    dir.writeUInt32LE(data.length, b + 8);
    dir.writeUInt32LE(offset, b + 12);
    offset += data.length;
  });

  return Buffer.concat([header, dir, ...images.map((i) => i.data)]);
};

(async () => {
  const micro = fs.readFileSync(p('public/assets/favicon.svg'));
  const tiny = fs.readFileSync(p('assets-source/favicon-16.svg'));
  const apple = fs.readFileSync(p('assets-source/apple-touch-icon.svg'));

  // 16 usa la variante engrosada: con el trazo normal mide 1,2 px reales y se
  // deshace en el antialias. 32 y 48 tienen pixeles de sobra para el recorrido
  // completo.
  fs.writeFileSync(
    p('public/favicon.ico'),
    buildIco([
      { size: 16, data: await png(tiny, 16) },
      { size: 32, data: await png(micro, 32) },
      { size: 48, data: await png(micro, 48) },
    ])
  );

  // Sin esquinas redondeadas propias: iOS aplica su mascara y quedaria doble
  // redondeo con una franja de fondo en el borde.
  fs.writeFileSync(p('public/apple-touch-icon.png'), await png(apple, 180));
  console.log('iconos regenerados');

  if (process.argv.includes('--og')) {
    const src = p('qa-screens/og-preview-2x.png');
    if (!fs.existsSync(src)) {
      console.error('falta qa-screens/og-preview-2x.png — ver los pasos del encabezado');
      process.exit(1);
    }
    const out = p('public/assets/og-default.png');
    await sharp(src)
      .resize(1200, 630, { fit: 'fill', kernel: 'lanczos3' })
      // PNG y no WebP: LinkedIn y WhatsApp no resuelven WebP en la preview.
      .png({ compressionLevel: 9, palette: true, quality: 92, effort: 10 })
      .toFile(out);
    const meta = await sharp(out).metadata();
    console.log(`og-default.png -> ${meta.width}x${meta.height}, ${(fs.statSync(out).size / 1024).toFixed(1)} KB`);
  }
})();
