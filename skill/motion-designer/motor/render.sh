#!/bin/bash
# Renderiza uma composição do motion-studio no formato certo.
# Uso: render.sh <IdComposicao> <saida-sem-extensao> [--props='{"som":true}'] [--frames=0-60]
#  - composição 1080x1920 (reels): sai .mov ProRes 4444 COM TRANSPARÊNCIA (joga por cima no editor de vídeo)
#  - composição 1920x1080: sai .mp4 H.264
#  - se props tiverem "som":true, gera também <saida>-sfx.wav só com os efeitos
set -euo pipefail
ID="$1"; OUT="$2"; shift 2
MOTOR="$(cd "$(dirname "$0")" && pwd -P)"
STUDIO="${MOTION_STUDIO:-$(cd "$MOTOR/../../../studio" && pwd -P)}"
cd "$STUDIO"
LARG=$(npx remotion compositions src/index.ts 2>/dev/null | awk -v id="$ID" '$1==id {print $3}' | cut -dx -f1)
# reels EDITADO inteiro (id com "Editado") sai .mp4 normal; reels overlay sai .mov com alfa
if [ "$LARG" = "1080" ] && [[ "$ID" != *Editado* ]]; then
  npx remotion render src/index.ts "$ID" "$OUT.mov" --codec=prores --prores-profile=4444 --pixel-format=yuva444p10le --image-format=png --log=error "$@"
  echo "$OUT.mov"
else
  npx remotion render src/index.ts "$ID" "$OUT.mp4" --codec=h264 --crf=16 --log=error "$@"
  echo "$OUT.mp4"
fi
if printf '%s' "$*" | grep -q '"som":true'; then
  npx remotion render src/index.ts "$ID" "$OUT-sfx.wav" --codec=wav --log=error "$@" && echo "$OUT-sfx.wav"
fi
