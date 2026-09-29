#!/bin/bash
# Mapa de takes do bruto: acha cada trecho falado (entre silêncios) e transcreve ele isolado.
# Serve pra escolher os cortes. REGRA: de cada fala repetida vale o ÚLTIMO take
# (salvo o criador dizer "usa a última / logo após"); murmúrio ensaiando a próxima fala não é take.
# Uso: takes.sh <bruto.mp4> [limiar_db=-35] [silencio_min_s=0.25]
set -euo pipefail
B="$1"; LIM="${2:--35}"; MIN="${3:-0.25}"
T=$(mktemp -d); ffmpeg -v error -y -i "$B" -vn -ac 1 -ar 16000 "$T/a.wav"
DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$T/a.wav")
ffmpeg -i "$T/a.wav" -af silencedetect=noise=${LIM}dB:d=$MIN -f null - 2>&1 | grep -oE "silence_(start|end): [0-9.]+" | awk '{print $2}' > "$T/s.txt"
python3 - "$T" "$DUR" <<'PY'
import sys,subprocess,os
T,DUR=sys.argv[1],float(sys.argv[2]); v=[float(x) for x in open(f"{T}/s.txt")]
# pares (start,end) de silêncio -> trechos falados entre eles
sil=[(v[i],v[i+1] if i+1<len(v) else DUR) for i in range(0,len(v),2)]
fala=[];ant=0.0
for a,b in sil:
    if a-ant>0.35: fala.append((ant,a))
    ant=b
if DUR-ant>0.35: fala.append((ant,DUR))
m=os.environ.get("WHISPER_MODELO", os.path.expanduser("~/.cache/whisper-cpp/ggml-base.bin"))
for a,b in fala:
    subprocess.run(["ffmpeg","-v","error","-y","-ss",f"{a:.2f}","-to",f"{b:.2f}","-i",f"{T}/a.wav",f"{T}/seg.wav"],check=True)
    txt=subprocess.run(["whisper-cli","-m",m,"-l",os.environ.get("WHISPER_LINGUA","pt"),"-nt","-np","-f",f"{T}/seg.wav"],capture_output=True,text=True).stdout.replace("\n"," ").strip()
    print(f"[{a:7.2f} - {b:7.2f}] {txt}")
PY
rm -rf "$T"
