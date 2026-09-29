#!/bin/bash
# Põe a trilha de fundo num vídeo JÁ PRONTO (HyperFrames, render antigo, etc.), sem re-renderizar a imagem.
# Uso: mixar-trilha.sh <video.mp4> <slug-da-trilha> <saida.mp4> [volume=0.14] [inicio-na-musica-s=0]
# Trilha por BAIXO da voz, entra com fade de 0,6s e sai com fade de 1,5s no fim do vídeo.
set -euo pipefail
IN="$1"; SLUG="$2"; OUT="$3"; VOL="${4:-0.14}"; INI="${5:-0}"
MOTOR="$(cd "$(dirname "$0")" && pwd -P)"
STUDIO="${MOTION_STUDIO:-$(cd "$MOTOR/../../../studio" && pwd -P)}"
TR="$STUDIO/public/trilhas/$SLUG.mp3"
[ -f "$TR" ] || { echo "trilha não encontrada: $TR (rode trilha.sh antes)"; exit 1; }
D=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$IN")
FO=$(awk -v d="$D" 'BEGIN{printf "%.2f", d-1.5}')
ffmpeg -loglevel error -y -i "$IN" -ss "$INI" -i "$TR" -filter_complex \
  "[1:a]atrim=0:$D,asetpts=PTS-STARTPTS,volume=$VOL,afade=t=in:d=0.6,afade=t=out:st=$FO:d=1.5[m];[0:a][m]amix=inputs=2:duration=first:normalize=0[a]" \
  -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 192k -movflags +faststart "$OUT"
echo "$OUT"
