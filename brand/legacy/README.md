# Assets de marca deprecados

Nada de esta carpeta se sirve. Está fuera de `public/`, así que no llega al
build ni puede quedar referenciado por accidente desde producción.

Se conservan por decisión del owner: son historia de marca, no basura.

| Archivo | Qué es | Reemplazado por |
|---|---|---|
| `logo-v1.svg` | Isotipo de la V1. Glifo "D" con trazas de circuito, gradiente teal a navy. Vivía en `public/assets/logo.svg`. | Sacred Weave |
| `BrandMark.hexagon.astro.txt` | Componente intermedio de FASE 3.2: una M inscrita en un hexágono con retícula interior. Descartado al adoptarse Sacred Weave. Se guarda con extensión `.txt` para que Astro no lo compile. | `src/components/BrandMark.astro` |

## Verificación

Ningún archivo de `src/` ni de `public/` referencia estos assets. Si en algún
momento aparece una referencia, el build no va a fallar — el archivo
simplemente no existirá en `dist/`, y el 404 será silencioso. Por eso conviene
correr la comprobación antes de publicar:

```
grep -rn "logo.svg\|logo-v1\|hexagon" src/ public/
```

Debe devolver vacío.
