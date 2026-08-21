/**
 * Verifica que el buzon interno NUNCA aparezca en el sitio compilado.
 *
 *   node scripts/check-no-private-mailbox.cjs
 *
 * La direccion publica es consultas@digitaimotor.lat. El buzon que recibe de
 * verdad es interno y el visitante no tiene por que conocerlo: aparece solo en
 * la configuracion de reenvio del registrador y en docs/DEPLOYMENT.md.
 *
 * El patron esta ACA y no en `src/`, para que la cadena no exista dentro del
 * codigo del sitio y no pueda filtrarse por un import descuidado.
 */
const fs = require('fs');
const path = require('path');

const PROHIBIDOS = [
  /digitai\.motor\.agency@gmail\.com/i,
  /digitai[._-]?motor[._-]?agency/i,
  /@gmail\.com/i,
];

const dist = path.join(__dirname, '..', 'dist');
if (!fs.existsSync(dist)) {
  console.error('No existe dist/. Correr npm run build antes.');
  process.exit(1);
}

const hallazgos = [];
const walk = (dir) => {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const f = path.join(dir, e.name);
    if (e.isDirectory()) { walk(f); continue; }
    if (!/\.(html|js|css|xml|txt|json)$/.test(e.name)) continue;
    const contenido = fs.readFileSync(f, 'utf8');
    for (const re of PROHIBIDOS) {
      const m = contenido.match(re);
      if (m) hallazgos.push(`${path.relative(dist, f)} -> "${m[0]}"`);
    }
  }
};
walk(dist);

if (hallazgos.length) {
  console.error('FALLA: el buzon interno se filtro al sitio compilado');
  hallazgos.forEach((h) => console.error('  ' + h));
  process.exit(1);
}
console.log('OK — el buzon interno no aparece en ningun archivo de dist/');
