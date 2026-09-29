# Efeitos sonoros

- **Regra:** só som de INTERFACE (clique, pop, "colocar algo", digitação, notificação), baixinho (volume ≤ 0,3), colado no frame exato da ação. Laser, whoosh de arrasto, impacto, riser e brilho brigam com a trilha de fundo: não usar em reels.
- Banco aprovado `ui-*` em `studio/public/sfx/ui/` (sons gravados; baixados pelo `instalar.sh`): `ui-pop`, `ui-clique`, `ui-notificacao`, `ui-mensagem`, `ui-digitando`, `ui-clique-suave`, `ui-pop-grave`, `ui-tecla`.
- Uso: `<Som nome="ui-pop" em={frame} />` (`src/ds/som.tsx`), ligado por `<SomProvider ligado>`. No modo editado inteiro vem ligado; no overlay, desligado (o criador mixa no editor dele).
- Nomes antigos (banco sintetizado, reprovado por soar artificial) são redirecionados sozinhos: clique→ui-clique, tecla→ui-tecla, ding→ui-notificacao; whoosh/swoosh/impacto/riser ficam mudos.
## Trilha sonora (fundo)
- **Todo reels editado leva trilha**, bem baixa, por baixo da voz; os SFX de interface continuam por cima.
- **Acervo pessoal** (música com direito autoral, fora do Git): `studio/public/trilhas/<slug>.mp3` + `CATALOGO.md` (slug, duração, clima). Entrar trilha nova: `motor/trilha.sh <arquivo> <slug> "<clima>"` (normaliza em -20 LUFS, então um volume serve pra todas).
- **Nível:** volume 0,14 (`VOLUME_TRILHA`), ~17-19 dB abaixo da voz (voz ~-18 LUFS, trilha ~-35). Fade de entrada 0,6s e de saída 1,5s.
- **Remotion:** `<ReelsEditado trilha="<slug>" trilhaInicio={s}>` (componente `src/ds/trilha.tsx`).
- **Vídeo já pronto** (HyperFrames, render antigo): `motor/mixar-trilha.sh <video.mp4> <slug> <saida.mp4> [volume] [inicio]` (copia a imagem, só mistura o áudio).
- **Escolha:** pelo clima do vídeo, declarada na linha de som do script de motion (portão). Overlay sai sem trilha (o criador mixa no editor).
