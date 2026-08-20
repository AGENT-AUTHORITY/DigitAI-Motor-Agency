const fs = require('fs');
let b = fs.readFileSync('docs/BRAND.md', 'utf8');

const start = b.indexOf('## Isotipo');
const end = b.indexOf('## Geo');
if (start === -1 || end === -1) { console.error('marcadores no encontrados'); process.exit(1); }

const block = `## Isotipo — SACRED WEAVE

Identidad definitiva. **Cerrado. No se abren más familias ni exploraciones.**

Sacred Weave es la evolución del concepto Return Weave. Reemplaza al isotipo
previo (una M inscrita en un hexágono), que queda descartado.

### Principios

- **Retorno** — el recorrido vuelve sobre sí mismo en vez de terminar en punta
- **Iteración** — el pliegue se repite a distinta escala
- **Sistema** — dos rutas que se sostienen mutuamente, no una flecha sola
- **Centro** — el núcleo es el punto al que todo apunta
- **Expansión** — proporcional, no arbitraria
- **Inteligencia** — el vacío central: el sistema mira hacia adentro antes de devolver
- **Geometría sagrada** — simetría exacta como estructura, no como ornamento
- **Crecimiento ordenado** — la abundancia como expansión proporcional, no como ruido

### Construcción

Dos recorridos recíprocos: cada uno es el otro **rotado 180°**. Simetría
rotacional de orden 2, no simetría espejo — eso es lo que lo hace leer como
retorno y no como flecha.

Las rutas son ortogonales. El conjunto va rotado 45°; la rotación es lo único
que las pone en diagonal.

Los pliegues siguen la progresión **11 · 18 · 29 · 47 · 76 · 123** y el núcleo
es un cuadrado con vacío central. Ambas cosas están definidas en el archivo
maestro del logo; no se afirma nada que no esté ahí.

### Color

| Rol | Token | Valor |
|---|---|---|
| Ruta A | \`--brand-ink\` | \`#F4F8FF\` |
| Ruta B + núcleo | \`--brand-accent\` | \`var(--accent)\` → \`#2388FF\` |
| Relleno del núcleo y keyline | \`--brand-ground\` | \`#05070B\` |

**Blanco + azul digitAI. Nada más.**

**Sin verde.** El verde queda reservado a la interfaz para `positive`,
`revenue`, `connected` y `success`. Si formara parte del isotipo perdería ese
significado.

**Un solo azul.** \`--brand-accent\` apunta a \`--accent\`, así que el azul de
marca y el de interfaz son el mismo. Queda resuelta la tensión de dos azules
que existía en la versión anterior.

**\`--brand-ground\`** rellena el núcleo y dibuja el keyline que lo separa de
las rutas que pasan por detrás. Debe coincidir con el fondo sobre el que se
apoya el símbolo. Sobre superficie clara hay que redefinirlo:
\`style="--brand-ground:#fff"\`.

### Funciona en

| Contexto | Verificado |
|---|---|
| Blanco sobre negro | sí |
| Negro sobre blanco | sí, con \`--brand-ground\` redefinido |
| Azul sobre fondo oscuro | sí |
| Monocromo una tinta | sí |

### Variante micro — oficial

Con trazo 16 sobre lienzo de 320, **a 32px el trazo mide 1,6px y la separación
entre pliegues 1,8px**: se cierran. Medido en navegador.

La variante compacta **conserva silueta, centro y lectura de weave**. Corta los
dos pliegues internos y engrosa el trazo a 24. No deforma el símbolo original:
es el mismo trazado con menos vueltas.

**Se elige sola.** \`BrandMark\` la aplica bajo 40px sin que quien la consume
tenga que decidirlo.

### Escalas verificadas

16 · 24 · 28 · 32 · 48 · 64 · 128 px, en color, monocromo blanco y monocromo
negro. Header a 32px, footer a 30px.

### Lockups

| | Separación | Wordmark |
|---|---|---|
| Horizontal | 0,72× la altura del símbolo | 0,62× |
| Vertical | 0,5× | 0,52×, centrado sobre el eje |

**Espacio de seguridad:** 0,4× la altura del símbolo. \`<BrandLockup clearspace />\`.

**Alineación vertical:** medida en navegador, 0px de desalineación entre el
centro del símbolo y el del wordmark.

### Wordmark

**digitAI Motor.** Pieza **secundaria** respecto del símbolo.

"AI" en \`--brand-accent\` y peso 800; "Motor" en peso 350; el resto en 500.
El contraste de peso separa las tres partes sin abrir espacio.
Tracking -0.035em.

Sin efectos, sin glow, sin gradientes. No se rediseña tipografía custom.

### Animación

Carga: se dibuja la primera trayectoria, la segunda completa el weave, ambas
quedan estáticas. **760ms en total**, una sola vez. Sin loop en el header.
Hover: sin animación.

Con \`prefers-reduced-motion\` el símbolo aparece completo, sin trazado.

### Archivos

| Archivo | Uso |
|---|---|
| \`BrandMark.astro\` | Isotipo inline. API: \`size\`, \`variant\`, \`mono\`, \`animated\`, \`class\`, \`ariaLabel\` |
| \`BrandLockup.astro\` | Horizontal y vertical |
| \`logo-mark.svg\` | Color, standalone |
| \`logo-mark-mono-light.svg\` | Blanco sobre oscuro |
| \`logo-mark-mono-dark.svg\` | Negro sobre claro |
| \`logo-lockup-horizontal.svg\` | Lockup horizontal |
| \`logo-lockup-vertical.svg\` | Lockup vertical |
| \`favicon.svg\` | Variante micro sobre fondo redondeado |

**Pendiente:** \`favicon.ico\` y \`apple-touch-icon.png\` requieren rasterizado;
se generan a partir de \`favicon.svg\`.

### Legacy

\`brand/legacy/\` — fuera de \`public/\`, así que no llega al build y producción
no puede usarlo. Contiene el isotipo de la V1 y el componente hexagonal
intermedio. Se conservan por decisión del owner.

`;

b = b.slice(0, start) + block + b.slice(end);
fs.writeFileSync('docs/BRAND.md', b);
console.log('BRAND.md: Sacred Weave');
