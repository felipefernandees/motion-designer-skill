#!/bin/bash
# Gera um BRUTO DE TESTE (voz do macOS + fundo animado) e prepara a edição "exemplo".
# Serve pra testar a instalação inteira sem ter gravado nada. Tem um take ERRADO de propósito
# (a regra da skill é usar o ÚLTIMO take de cada fala).
# Uso: demo.sh   (depois: npx remotion studio  →  composição "ModeloEditado")
set -euo pipefail
MOTOR="$(cd "$(dirname "$0")" && pwd -P)"
STUDIO="${MOTION_STUDIO:-$(cd "$MOTOR/../../../studio" && pwd -P)}"
command -v say >/dev/null || { echo "demo.sh precisa do comando 'say' (macOS). No Linux, grave um vídeo curto e rode motor/preparar.py direto."; exit 1; }
VOZ="${VOZ_DEMO:-Luciana}"; say -v "$VOZ" "" 2>/dev/null || VOZ=""
T=$(mktemp -d)
FALAS=(
  "Esse vídeo foi editado... não, espera, de novo."
  "Esse vídeo foi editado inteiro por inteligência artificial."
  "Os cortes, as legendas e o motion saíram sozinhos."
  "E pra fazer igual, você só precisa de duas coisas."
  "Comenta MOTION que eu te mando o passo a passo."
)
python3 - "$T" "$VOZ" "${FALAS[@]}" <<'PY'
import sys, subprocess, json
T, voz, falas = sys.argv[1], sys.argv[2], sys.argv[3:]
t, lista, cortes = 1.0, [], []
subprocess.run(["ffmpeg","-v","error","-y","-f","lavfi","-i","anullsrc=r=48000:cl=mono","-t","1",f"{T}/sil.wav"],check=True)
lista.append(f"file '{T}/sil.wav'")
for i, f in enumerate(falas):
    cmd = ["say","-o",f"{T}/f{i}.aiff"] + (["-v",voz] if voz else []) + [f]
    subprocess.run(cmd, check=True)
    subprocess.run(["ffmpeg","-v","error","-y","-i",f"{T}/f{i}.aiff","-ar","48000","-ac","1",f"{T}/f{i}.wav"],check=True)
    d = float(subprocess.run(["ffprobe","-v","error","-show_entries","format=duration","-of","csv=p=0",f"{T}/f{i}.wav"],capture_output=True,text=True).stdout)
    if i > 0:  # o take 0 é o errado: fica no bruto, mas não entra nos cortes
        cortes.append([round(t - .08, 2), round(t + d + .1, 2), f])
    lista += [f"file '{T}/f{i}.wav'", f"file '{T}/sil.wav'"]
    t += d + 1.0
open(f"{T}/l.txt","w").write("\n".join(lista))
subprocess.run(["ffmpeg","-v","error","-y","-f","concat","-safe","0","-i",f"{T}/l.txt",f"{T}/voz.wav"],check=True)
json.dump(cortes, open(f"{T}/cortes.json","w"), ensure_ascii=False, indent=1)
print(f"bruto de teste: {t:.1f}s, {len(cortes)} falas boas (1 take errado descartado)")
PY
DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$T/voz.wav")
ffmpeg -v error -y -f lavfi -i "gradients=s=1080x1920:c0=0x2b2d42:c1=0x8d99ae:speed=0.02:d=$DUR" -i "$T/voz.wav" -c:v libx264 -pix_fmt yuv420p -c:a aac -shortest "$T/bruto.mp4" 2>/dev/null \
 || ffmpeg -v error -y -f lavfi -i "color=c=0x3a3d4d:s=1080x1920:d=$DUR" -i "$T/voz.wav" -c:v libx264 -pix_fmt yuv420p -c:a aac -shortest "$T/bruto.mp4"
python3 "$MOTOR/preparar.py" exemplo "$T/bruto.mp4" "$T/cortes.json"
rm -rf "$T"
echo "Pronto. Abra o estúdio: cd \"$STUDIO\" && npx remotion studio  → composição ModeloEditado"
