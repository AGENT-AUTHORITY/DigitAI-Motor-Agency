# assets-source

Originales de los que se derivan los assets web. **No se sirven.** Nada de acá
llega al build: `public/` es la única carpeta que Astro publica.

Está en `.gitignore` a propósito. Son archivos de entrada, pesados y binarios;
lo que se versiona es el resultado optimizado en `public/assets/`, no la
materia prima. Si necesitás recuperar un original, vive fuera del repo.

| Archivo | Origen | Deriva en |
|---|---|---|
| `hero/antenna-original.mp4` | 1080×1920, 30fps, 6,19 MB | `hero-signal.webm`, `hero-signal.mp4`, `hero-signal-poster.webp` |

Los comandos para regenerar están en `scripts/build-hero-assets.sh`.
