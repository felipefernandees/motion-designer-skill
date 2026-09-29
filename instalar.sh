#!/bin/bash
# Instala tudo que a skill motion-designer precisa. Pode rodar de novo quando quiser (é idempotente).
# Uso: ./instalar.sh            (instala e liga a skill em ~/.claude/skills/motion-designer)
#      ./instalar.sh --sem-link (instala sem ligar a skill; útil se você liga dentro de um projeto/vault)
set -euo pipefail
RAIZ="$(cd "$(dirname "$0")" && pwd -P)"
STUDIO="$RAIZ/studio"; SKILL="$RAIZ/skill/motion-designer"
ok()   { printf "  \033[32m✓\033[0m %s\n" "$1"; }
falta(){ printf "  \033[31m✗\033[0m %s\n" "$1"; FALTOU=1; }
FALTOU=0

echo "1/6 · Dependências do sistema"
command -v node >/dev/null && [ "$(node -p 'process.versions.node.split(".")[0]')" -ge 20 ] && ok "Node $(node -v)" || falta "Node 20+ (https://nodejs.org ou 'brew install node')"
command -v ffmpeg >/dev/null && ok "ffmpeg" || falta "ffmpeg ('brew install ffmpeg')"
command -v python3 >/dev/null && ok "python3" || falta "python3"
command -v whisper-cli >/dev/null && ok "whisper-cli (transcrição local)" || falta "whisper-cpp ('brew install whisper-cpp')"
command -v yt-dlp >/dev/null && ok "yt-dlp (baixar vídeo de referência)" || echo "  · yt-dlp (opcional): 'brew install yt-dlp'"
command -v gh >/dev/null && ok "gh (colaboração no GitHub)" || echo "  · gh (opcional, pra mandar/receber melhorias): 'brew install gh' e 'gh auth login'"
[ "$FALTOU" = 0 ] || { echo "Instale o que falta e rode de novo."; exit 1; }

echo "2/6 · Pacotes do estúdio (Remotion)"
( cd "$STUDIO" && npm install --no-fund --no-audit --loglevel=error ) && ok "npm install"

echo "3/6 · Modelo de transcrição (whisper, ~150 MB)"
MOD="${WHISPER_MODELO:-$HOME/.cache/whisper-cpp/ggml-base.bin}"
if [ -f "$MOD" ]; then ok "já existe: $MOD"; else
  mkdir -p "$(dirname "$MOD")"
  curl -fL --progress-bar -o "$MOD" https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-base.bin && ok "baixado: $MOD"
fi
echo "     (qualidade melhor: baixe ggml-large-v3-turbo-q5_0.bin do mesmo repositório e exporte WHISPER_MODELO=<caminho>)"

echo "4/6 · Logos oficiais (~950 apps e IAs, pacote aberto @lobehub/icons + oficiais extras)"
mkdir -p "$STUDIO/public/logos"
cp -n "$STUDIO"/node_modules/@lobehub/icons-static-svg/icons/*.svg "$STUDIO/public/logos/" 2>/dev/null || true
HF=https://raw.githubusercontent.com/heygen-com/hyperframes/main/docs/logo
curl -fsL "$HF/symbol-dark.svg" | sed '/<rect width="100" height="100" fill="black"\/>/d' > "$STUDIO/public/logos/hyperframes-color.svg"
curl -fsL "$HF/light.svg" -o "$STUDIO/public/logos/hyperframes-text.svg"
curl -fsL "$HF/dark.svg" -o "$STUDIO/public/logos/hyperframes-text-branco.svg"
ok "$(ls "$STUDIO/public/logos" | wc -l | tr -d ' ') logos em studio/public/logos"

echo "5/6 · Sons de interface (gravados; Mixkit, licença gratuita pra uso comercial)"
UI="$STUDIO/public/sfx/ui"; mkdir -p "$UI"
baixa() { # id_mixkit nome duracao
  [ -f "$UI/$2.mp3" ] && return 0
  curl -fsL -o "/tmp/mk-$2.mp3" "https://assets.mixkit.co/active_storage/sfx/$1/$1-preview.mp3"
  ffmpeg -v error -y -i "/tmp/mk-$2.mp3" -af "silenceremove=start_periods=1:start_threshold=-45dB,atrim=0:$3,afade=t=out:st=$(python3 -c "print(max(0,$3-0.12))"):d=0.12" -ar 44100 "$UI/$2.mp3"
}
baixa 3005 pop-leve 0.18; baixa 1109 click-select 0.35; baixa 2356 pop-notificacao 0.3; baixa 2354 msg-pop 0.6
baixa 1393 digitando-celular 1.3; baixa 275 hf-click-soft 0.3; baixa 2364 hf-pop 0.4; baixa 1386 hf-key-press 0.25
echo "Sons: Mixkit (https://mixkit.co/license/#sfxFree), uso comercial liberado, sem atribuição." > "$UI/LICENCA.txt"
ok "$(ls "$UI"/*.mp3 | wc -l | tr -d ' ') sons em studio/public/sfx/ui"

echo "6/6 · Ligar a skill no Claude Code"
[ -f "$SKILL/MEMORY.md" ] || cp "$SKILL/MEMORY.exemplo.md" "$SKILL/MEMORY.md"
if [ "${1:-}" != "--sem-link" ]; then
  mkdir -p "$HOME/.claude/skills"
  if [ -e "$HOME/.claude/skills/motion-designer" ]; then echo "  · já existe ~/.claude/skills/motion-designer (não mexi)"; else
    ln -s "$SKILL" "$HOME/.claude/skills/motion-designer" && ok "ligada em ~/.claude/skills/motion-designer"; fi
fi
( cd "$STUDIO" && npx tsc --noEmit -p . ) && ok "código do estúdio sem erro de tipo"

echo
echo "Pronto. Próximos passos:"
echo "  1. Abra uma sessão NOVA do Claude Code (skill nova só carrega em sessão nova)."
echo "  2. Teste sem gravar nada:  bash skill/motion-designer/motor/demo.sh   (macOS)"
echo "     e veja no estúdio:      cd studio && npm run studio   → composição ModeloEditado"
echo "  3. Peça pro Claude: \"edita esse vídeo inteiro\" (na 1ª vez ele faz o questionário do seu perfil)."
