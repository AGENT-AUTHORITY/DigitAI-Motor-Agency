# assets-source

Originales de los que se derivan los assets web. **No se sirven.** Nada de acá
llega al build: `public/` es la única carpeta que Astro publica.

Está en `.gitignore` a propósito. Son archivos de entrada, pesados y binarios;
lo que se versiona es el resultado optimizado en `public/assets/`, no la
materia prima. Si necesitás recuperar un original, vive fuera del repo.

La excepción es `service-heroes/`, que sí se versiona (hay una negación
explícita en `.gitignore`): son los PNG de los que salen los WebP de cada
service page, y sin ellos un clon nuevo no puede regenerar la imagen LCP.

| Archivo | Origen | Deriva en |
|---|---|---|
| `hero/antenna-original.mp4` | 1080×1920, 30fps, 6,19 MB | `hero-signal.webm`, `hero-signal.mp4`, `hero-signal-poster.webp` |
| `service-heroes/*.png` | 1672×941, 1,3–1,5 MB cada uno | `google-ads.webp`, `paid-media.webp`, `meta-ads.webp`, `cro-landing.webp`, `growth-engineering.webp`, `performance-creative.webp`, `cta.webp` |

Los PNG estaban en `public/assets/service-heroes/`. Astro copia `public/` tal
cual, así que se publicaban 9,6 MB que ningún documento referencia: los WebP
derivados pesan 295 KB en total y son los únicos que el sitio pide.

Los comandos para regenerar están en `scripts/build-hero-assets.sh` y
`scripts/build-service-heroes.cjs`.
