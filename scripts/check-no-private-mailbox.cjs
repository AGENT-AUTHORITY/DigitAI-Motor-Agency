
const fs = require('fs');
const path = require('path');

// Único Gmail autorizado a aparecer públicamente.
const EMAIL_PUBLICO = 'digitai.motor.agency@gmail.com';

const dist = path.join(__dirname, '..', 'dist');

if (!fs.existsSync(dist)) {
  console.error('No existe dist/. Ejecutar el build.');
  process.exit(1);
}

const hallazgos = [];

function revisar(directorio) {
  for (const entrada of fs.readdirSync(directorio, {
    withFileTypes: true
  })) {
    const archivo = path.join(directorio, entrada.name);

    if (entrada.isDirectory()) {
      revisar(archivo);
      continue;
    }

    if (!/\.(html|js|css|xml|txt|json)$/.test(entrada.name)) {
      continue;
    }

    const contenido = fs.readFileSync(archivo, 'utf8');

    const correos = contenido.match(
      /[a-z0-9._%+-]+@gmail\.com/gi
    ) || [];

    for (const correo of correos) {
      if (correo.toLowerCase() !== EMAIL_PUBLICO) {
        hallazgos.push(
          `${path.relative(dist, archivo)}: ${correo}`
        );
      }
    }
  }
}

revisar(dist);

if (hallazgos.length > 0) {
  console.error('Se detectaron correos Gmail no autorizados:');
  hallazgos.forEach(item => console.error(item));
  process.exit(1);
}

console.log('OK: no hay correos Gmail no autorizados.');
  
