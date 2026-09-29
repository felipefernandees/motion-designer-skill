# motion-designer · mapa e princípios

## Onde mora cada coisa
| O quê | Onde |
|---|---|
| Motor (código, node_modules) | `studio/` na raiz do repositório (ou o caminho em `MOTION_STUDIO`) |
| Linguagem de movimento (molas, easing, tracking) | `studio/src/ds/movimento.ts` |
| Brandings + qual é o padrão | `studio/src/ds/brandings/`: só o neutro `apple` vai pro Git; os do criador em `pessoais/<nome>.ts` (fora do Git, carregados sozinhos); o padrão fica no `perfil.md` |
| Formatos e área de desenho | `studio/src/ds/formatos.ts` |
| Som (liga/desliga, banco) | `src/ds/som.tsx`: banco aprovado `ui-*` em `public/sfx/ui/`; os `.wav` sintetizados antigos foram reprovados e são redirecionados/mudos |
| Trilhas de fundo (pessoal, fora do Git) | `public/trilhas/<slug>.mp3` + `CATALOGO.md`; componente `src/ds/trilha.tsx`; entrar com `motor/trilha.sh`, mixar vídeo pronto com `motor/mixar-trilha.sh` |
| Peças reaproveitáveis | `src/primitivas/` |
| Motions feitos (código) | `src/acervo/<topico>/<slug>/` |
| Modelo pra copiar | `src/acervo/_modelos/modelo-reels/` |
| Motions feitos (vídeo + ficha) | pasta de acervo definida no `perfil.md` (+ catálogo) |
| Logos de apps e IAs (950) | `public/logos/*.svg` |
| Scripts | `motor/` desta skill (`takes.sh`, `preparar.py`, `transcrever.sh`, `folha.sh`, `render.sh`, `trilha.sh`, `mixar-trilha.sh`) |
| Edição de bruto (modo editado) | `src/edicao/` (`ReelsEditado`, `Camera`, `Legendas`, `TelaCheia`, `agrupar.ts`, `tipos.ts`) |
| Brutos (proxy) e edições | `public/brutos/<id>.mp4`, `public/edicoes/<id>.json` |
| Sons aprovados | `public/sfx/ui/` (Mixkit + HyperFrames, licença em `LICENCA-mixkit.txt`) |
| Modelo do modo editado | `src/acervo/_modelos/modelo-editado/` |
| Perfil do criador (pessoal) | `perfil.md` (questionário em `referencias/onboarding.md`) |
| Memória do criador (pessoal) | `MEMORY.md` (modelo em `MEMORY.exemplo.md`) |
| Retomada | `HANDOFF.md` (pessoal) |
| Colaboração com o time | `COLABORACAO.md` na raiz do repositório |

## Arquitetura em 2 camadas
1. **Linguagem de movimento (fixa):** é o que dá a "fluidez" premium. Molas no padrão Apple (resposta + amortecimento), texto palavra por palavra com desfoque, câmera que dá zoom no ponto da ação, números que rolam, check que se desenha, saída com desfoque. Nunca muda por branding.
2. **Branding (troca):** cor, fonte, raio, sombra, vidro. Um arquivo por branding. Toda primitiva lê do `useBranding()`, nunca cor fixa.

Cada primitiva mede pela **área de desenho** (`useArea()`), então a mesma cena serve na faixa de cima do reels, na tela cheia ou no 16:9.

## Primitivas (catálogo rápido)
| Peça | Faz |
|---|---|
| `CenaTexto` | frase curta palavra por palavra, 1 palavra na cor de destaque, sai com desfoque |
| `Palco` | círculo da marca + aparelho subindo com mola, flutuação, zoom de câmera, saída |
| `Celular` | iPhone genérico 390x844 com Dynamic Island que abre (conteúdo livre) |
| `Cursor` | percorre pontos, aperta no clique, solta onda; toca clique se som ligado |
| `Check` | sucesso com quique + traço desenhado |
| `Marca` | círculo cobre a tela, palavra-marca sobe letra a letra, ponto estala |
| `Reels` | painel topo (810px) ou cheio (1920px), troca com mola, resto transparente |
| `Logo` | logo de app/IA (colorido ou pintado na cor pedida) |
| `IconeApp` | ícone de app no estilo Icon Composer (vidro, especular), com seleção |
| `Bandeira` | bandeiras BRL/USD/EUR/GBP em círculo |
| `Clawd` | mascote pixel do Claude Code (tchau, anda, pisca, arma). SÓ no gancho |
| Dentro do acervo | `Cartao` (cartão de crédito), notificação de vidro escuro, menu de vidro, campo digitando (ver `studio/src/acervo/demo-app/mundi-completo`) |

Peça boa que nasceu dentro de um motion e serviria em outro: promover pra `src/primitivas/` e registrar aqui.

## Pegadinhas
- `useCurrentFrame()` dentro de `<Sequence>` é LOCAL da cena. Timings da cena contam do 0 dela.
- Coordenadas dentro do `Celular` são do aparelho (tela começa no offset 10). O `Palco` escala (1,3 no 16:9).
- Stills de reels: usar `--image-format=png` (jpeg perde a transparência). A folha usa fundo cinza pra mostrar o alfa.
- Fonte SF Pro e SF Symbols não podem sair de app Apple (e a da Nomad é paga): texto e legenda em **Geist** (`ds/fontes.ts`), números em Inter Tight (aprovados).
- macOS não diferencia maiúscula: nunca ter `x.ts` e `X.tsx` na mesma pasta (quebrou o `legendas.ts` x `Legendas.tsx`).
- Bruto do DJI é HEVC 4K: sempre usar o proxy do `preparar.py`, nunca o original na composição.
- A fonte de título de marca real é licenciada: nunca baixar da LP de referência, achar equivalente no Google Fonts.
- Composição nova só aparece depois de registrada em `src/Root.tsx`.
- Preview ao vivo: `cd studio && npm run studio` (abre o Remotion Studio no navegador).
