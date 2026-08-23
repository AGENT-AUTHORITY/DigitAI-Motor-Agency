#!/usr/bin/env bash
# Recorte fisico y reencodeo de los videos de service hero.
#
#   bash scripts/build-service-videos.sh
#
# REQUIERE ffmpeg. No estaba instalado cuando se escribio esto, asi que el
# recorte todavia lo hace el CSS con object-fit: cover. Este script lo pasa al
# binario, que es donde corresponde: hoy se descargan pixeles que nunca se ven.
#
# EL RECORTE NO ES UNA ESTIMACION. Sale de la ventana que object-fit + el
# object-position aprobado muestran hoy en pantalla:
#
#   contenedor 1672x941  ->  relacion 1.7768
#   ancho del video      ->  1080
#   alto visible         ->  1080 / 1.7768 = 608 px
#   desplazamiento       ->  objectPosition% x (1920 - 608) = % x 1312
#
# Con eso la composicion aprobada se conserva pixel por pixel, se elimina el
# negro vertical y la marca de agua del pie queda fuera (esta por debajo de
# y=1850 en los siete).
#
# Sin upscale: 1080 es el ancho nativo y no se toca.

set -euo pipefail

RAIZ="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DIR="$RAIZ/public/assets/service-heroes"

# El respaldo de los originales va FUERA de public/. Astro copia public/ entera
# al build, asi que dejarlo adentro publicaba 19 MB de video que ningun
# documento pide — el mismo error que ya tenian los PNG fuente.
ORIG="$RAIZ/assets-source/service-heroes/_originales"

command -v ffmpeg >/dev/null || { echo "ffmpeg no encontrado. Instalarlo antes de correr esto."; exit 1; }

# archivo:desplazamiento_vertical_del_recorte
# El nombre de salida es el mismo que el de entrada: los MP4 no se renombran.
RECORTES=(
  "google-ads.mp4:682"
  "paid-media.mp4:722"
  "Meta-ads.mp4:630"
  "cro-landing.mp4:630"
  "Growth-Engiering-hero.mp4:656"
  "cta.mp4:630"
  "performance-creative.mp4:630"
)

mkdir -p "$ORIG"

for entrada in "${RECORTES[@]}"; do
  archivo="${entrada%%:*}"
  top="${entrada##*:}"
  src="$DIR/$archivo"
  [ -f "$src" ] || { echo "  falta $archivo"; continue; }

  # El original se guarda una sola vez: si se vuelve a correr, se reencodea
  # siempre desde el original y no sobre un archivo ya comprimido.
  [ -f "$ORIG/$archivo" ] || cp "$src" "$ORIG/$archivo"
  base="$ORIG/$archivo"
  nombre="${archivo%.mp4}"

  echo "  $archivo  crop 1080x608 +0,$top"

  # MP4 H.264 — fallback. -an elimina fisicamente la pista de audio.
  ffmpeg -y -loglevel error -i "$base" \
    -vf "crop=1080:608:0:$top" \
    -c:v libx264 -profile:v high -preset slow -crf 24 \
    -pix_fmt yuv420p -movflags +faststart -an \
    "$src"

  # WebM VP9 — principal. row-mt y tiles aprovechan varios nucleos.
  # crf 34 con b:v 0 es calidad constante: los negros y los degradados de los
  # haces aguantan sin bandear, que es lo que hay que cuidar en estas piezas.
  ffmpeg -y -loglevel error -i "$base" \
    -vf "crop=1080:608:0:$top" \
    -c:v libvpx-vp9 -crf 34 -b:v 0 -row-mt 1 -tile-columns 2 \
    -pix_fmt yuv420p -an \
    "$DIR/$nombre.webm"
done

echo
echo "  Verificacion:"
for entrada in "${RECORTES[@]}"; do
  archivo="${entrada%%:*}"
  nombre="${archivo%.mp4}"
  for f in "$DIR/$archivo" "$DIR/$nombre.webm"; do
    [ -f "$f" ] || continue
    audio=$(ffprobe -v error -select_streams a -show_entries stream=index -of csv=p=0 "$f" | wc -l)
    dim=$(ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=p=0:s=x "$f")
    kb=$(( $(stat -c%s "$f" 2>/dev/null || stat -f%z "$f") / 1024 ))
    printf "    %-34s %-10s %6s KB  audio:%s\n" "$(basename "$f")" "$dim" "$kb" "$([ "$audio" -eq 0 ] && echo no || echo SI)"
  done
done
