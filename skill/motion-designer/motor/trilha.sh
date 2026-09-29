#!/bin/bash
# Entra uma trilha no acervo: normaliza o volume (todas no mesmo nível, -20 LUFS) e registra no catálogo.
# Uso: trilha.sh <arquivo-de-audio> <slug> "<clima em poucas palavras>"
# Saída: studio/public/trilhas/<slug>.mp3 + linha em studio/public/trilhas/CATALOGO.md
# As trilhas são PESSOAIS (música com direito autoral): a pasta fica fora do Git.
set -euo pipefail
ORIG="$1"; SLUG="$2"; CLIMA="${3:-}"
MOTOR="$(cd "$(dirname "$0")" && pwd -P)"
STUDIO="${MOTION_STUDIO:-$(cd "$MOTOR/../../../studio" && pwd -P)}"
DEST="$STUDIO/public/trilhas"; mkdir -p "$DEST"
CAT="$DEST/CATALOGO.md"
[ -f "$CAT" ] || printf '# Trilhas do acervo\n\nNormalizadas em -20 LUFS (volume padrão na mixagem: 0,14, ~19 dB abaixo da voz).\n\n| slug | duração | clima | origem |\n|---|---|---|---|\n' > "$CAT"
ffmpeg -loglevel error -y -i "$ORIG" -vn -af loudnorm=I=-20:TP=-2:LRA=11 -ar 48000 -ac 2 -b:a 256k "$DEST/$SLUG.mp3"
DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$DEST/$SLUG.mp3" | awk '{printf "%d:%02d", $1/60, $1%60}')
grep -q "^| $SLUG |" "$CAT" || echo "| $SLUG | $DUR | $CLIMA | $(basename "$ORIG") |" >> "$CAT"
echo "$DEST/$SLUG.mp3"
