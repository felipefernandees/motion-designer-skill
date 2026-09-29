#!/bin/bash
# Transcreve o vídeo do criador com tempo por palavra (base da sincronia do motion).
# Uso: transcrever.sh <video> [saida.json]
# Saída: JSON [{"p": "palavra", "ini": seg, "fim": seg}, ...] + .txt com frases e tempos.
set -euo pipefail
VIDEO="$1"; SAIDA="${2:-${VIDEO%.*}.palavras.json}"
MODELO="${WHISPER_MODELO:-$HOME/.cache/whisper-cpp/ggml-base.bin}"   # modelo maior = transcrição melhor (ver README)
TMP=$(mktemp -d)
ffmpeg -loglevel error -y -i "$VIDEO" -ar 16000 -ac 1 -c:a pcm_s16le "$TMP/a.wav"
whisper-cli -m "$MODELO" -l "${WHISPER_LINGUA:-pt}" -f "$TMP/a.wav" -ml 1 -sow -ojf -of "$TMP/t" >/dev/null 2>&1
python3 - "$TMP/t.json" "$SAIDA" <<'PY'
import json, sys
d = json.load(open(sys.argv[1]))
out = []
for seg in d.get("transcription", []):
    w = seg["text"].strip()
    if not w:
        continue
    out.append({"p": w, "ini": seg["offsets"]["from"] / 1000, "fim": seg["offsets"]["to"] / 1000})
json.dump(out, open(sys.argv[2], "w"), ensure_ascii=False, indent=0)
# versão legível: blocos de ~8 palavras com tempo
txt = sys.argv[2].replace(".json", ".txt")
with open(txt, "w") as f:
    for i in range(0, len(out), 8):
        b = out[i:i + 8]
        f.write(f"[{b[0]['ini']:6.2f}s] " + " ".join(x["p"] for x in b) + "\n")
print(f"{len(out)} palavras -> {sys.argv[2]}")
PY
rm -rf "$TMP"
