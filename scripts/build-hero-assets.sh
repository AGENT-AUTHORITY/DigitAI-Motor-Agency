#!/usr/bin/env bash
#
# Genera los assets web del hero desde el original vertical.
# Requiere ffmpeg en el PATH.
#
#   bash scripts/build-hero-assets.sh
#
# El original NO se modifica y NO se sirve: vive en assets-source/, que está
# en .gitignore. Lo que se publica es únicamente el resultado en public/assets/.

set -euo pipefail

SRC="assets-source/hero/antenna-original.mp4"
OUT="public/assets"

if ! command -v ffmpeg >/dev/null 2>&1; then
  echo "ffmpeg no está en el PATH. Instalalo y volvé a correr esto."
  exit 1
fi

if [ ! -f "$SRC" ]; then
  echo "No encuentro $SRC"
  exit 1
fi

mkdir -p "$OUT"

echo "1/3 · WebM (VP9)…"
# scale a 720 de ancho con -2 para que el alto quede par, que VP9 exige.
# crf 34 con b:v 0 es calidad constante: el bitrate lo decide el codec.
ffmpeg -y -i "$SRC" \
  -vf "scale=720:-2:flags=lanczos,fps=24" \
  -an \
  -c:v libvpx-vp9 -crf 34 -b:v 0 \
  -row-mt 1 -deadline good -cpu-used 2 \
  "$OUT/hero-signal.webm"

echo "2/3 · MP4 (H.264 fallback)…"
# faststart mueve el índice al principio: sin eso el navegador tiene que
# descargar el archivo entero antes de poder empezar a reproducir.
ffmpeg -y -i "$SRC" \
  -vf "scale=720:-2:flags=lanczos,fps=24" \
  -an \
  -c:v libx264 -crf 28 -preset slow \
  -movflags +faststart -pix_fmt yuv420p \
  "$OUT/hero-signal.mp4"

echo "3/3 · Poster (WebP)…"
# 2.4s: elegido dentro de la ventana 1.5–3.5s. Ajustá -ss si otro frame
# representa mejor la antena y deja una zona limpia para los overlays.
ffmpeg -y -ss 00:00:02.4 -i "$SRC" \
  -frames:v 1 \
  -vf "scale=720:-2:flags=lanczos" \
  -c:v libwebp -quality 76 \
  "$OUT/hero-signal-poster.webp"

echo
echo "Listo. Pesos:"
ls -lh "$OUT"/hero-signal.webm "$OUT"/hero-signal.mp4 "$OUT"/hero-signal-poster.webp \
  | awk '{printf "  %-34s %s\n", $9, $5}'
echo
echo "Objetivo WebM: ideal <1 MB · aceptable 1–1,5 MB · revisar sobre ~2 MB."
echo "Si el WebM pasa de 1,5 MB, subí el crf (por ejemplo 36 o 38) y repetí."
echo
echo "Después corré 'npm run build': el hero detecta los assets solo."
