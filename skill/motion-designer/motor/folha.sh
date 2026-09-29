#!/bin/bash
# Folha de conferência: renderiza frames e monta uma imagem lado a lado (fundo cinza mostra a transparência).
# Uso: folha.sh <IdComposicao> <saida.png> <frame1> <frame2> ...
set -euo pipefail
ID="$1"; OUT="$2"; shift 2
MOTOR="$(cd "$(dirname "$0")" && pwd -P)"
STUDIO="${MOTION_STUDIO:-$(cd "$MOTOR/../../../studio" && pwd -P)}"
cd "$STUDIO"
TMP=$(mktemp -d); i=0; ENTRADAS=()
for fr in "$@"; do
  npx remotion still src/index.ts "$ID" "$TMP/$i.png" --frame="$fr" --scale=0.4 --image-format=png --log=error
  ENTRADAS+=(-i "$TMP/$i.png"); i=$((i+1))
done
W=$(ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=p=0 "$TMP/0.png")
L=$(echo "$W" | cut -d, -f1); A=$(echo "$W" | cut -d, -f2)
ffmpeg -loglevel error -y "${ENTRADAS[@]}" -filter_complex "$(for j in $(seq 0 $((i-1))); do printf "[%d]" $j; done)hstack=inputs=$i,format=rgba[h];color=c=0x444444:s=$((L*i))x${A}[bg];[bg][h]overlay=format=auto" -frames:v 1 "$OUT"
rm -rf "$TMP"; echo "$OUT"
