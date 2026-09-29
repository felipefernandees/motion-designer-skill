# motion-designer · edição de reels com IA no padrão Apple

Skill para o **Claude Code** que edita reels inteiros a partir do vídeo bruto (com retakes) e cria motion design em código, com acabamento premium no padrão de interface da Apple.

Você manda o **bruto**, o **roteiro** e (quase sempre) um **vídeo de referência**. A skill:
1. acha cada fala no bruto e usa **o último take** de cada uma (os retakes e ensaios saem);
2. monta o reels: **sua câmera embaixo, motion em cima** e até 2 momentos em **tela cheia**;
3. anima com **interfaces reais** (a janela do app, o post, a tela do GitHub, a caixa de comentários do Instagram), **logos oficiais**, **mola física**, zoom no ponto da ação e saída com desfoque;
4. põe **legenda** no seu estilo e **efeitos sonoros de interface** baixinhos;
5. mostra o **script de motion** antes de construir, confere uma folha de quadros contra um checklist de qualidade e só renderiza com o seu OK.

Tudo roda na sua máquina: Remotion (vídeo em React), ffmpeg e whisper (transcrição local, sem API paga).

---

## Instalação (macOS; Linux funciona com ajustes)

### 1. Pré-requisitos
```bash
brew install node ffmpeg whisper-cpp yt-dlp gh
gh auth login          # só se for colaborar (mandar/receber melhorias)
```
Node 20 ou mais novo. [Claude Code](https://claude.com/claude-code) instalado.

### 2. Clonar e instalar
```bash
git clone https://github.com/<dono>/motion-designer-skill.git
cd motion-designer-skill
./instalar.sh
```
O `instalar.sh`:
- instala o estúdio (Remotion);
- baixa o modelo de transcrição (whisper base, ~150 MB);
- instala as ~950 logos oficiais de apps e IAs;
- baixa os sons de interface;
- liga a skill em `~/.claude/skills/motion-designer`.

Pra ligar só dentro de um projeto (um "segundo cérebro", por exemplo), rode `./instalar.sh --sem-link` e crie um link manual para `skill/motion-designer` dentro de `.claude/skills/` do projeto.

### 3. Testar sem gravar nada
```bash
bash skill/motion-designer/motor/demo.sh      # gera um bruto de teste com a voz do Mac (com 1 take errado de propósito)
cd studio && npm run studio                   # abre o estúdio → composição "ModeloEditado"
```
Você deve ver:
- o gancho com a logo do Claude e o mascote;
- frases entrando palavra por palavra;
- uma tela cheia;
- legendas;
- o take errado cortado.

### 4. Primeiro uso de verdade
Abra uma **sessão nova** do Claude Code e diga, por exemplo:
> edita esse vídeo inteiro: /caminho/do/bruto.mp4 · referência: <link do reel> · roteiro: <cola aqui ou diga onde está>

Na **primeira vez**, a skill faz um questionário curto (`skill/motion-designer/referencias/onboarding.md`) pra se adaptar a você:
- de onde vêm seus roteiros (Notion, Obsidian, Docs...);
- se você costuma mandar referência;
- onde ficam os brutos e o acervo;
- branding, cor e estilo de legenda;
- regras de texto;
- com quem você troca melhorias.

As respostas viram o seu `perfil.md`, que é pessoal e nunca vai pro Git.

---

## Como a skill trabalha (o padrão de fábrica)

| Etapa | O que acontece | Você faz |
|---|---|---|
| Roteiro | lê o texto exato de cada fala (do seu gerenciador de conteúdo, arquivo ou conversa) | aponta onde está |
| Referência ou briefing | analisa a referência quadro a quadro (a *gramática*: o que entra, curva, câmera) ou faz 3 perguntas de briefing | manda o link ou responde |
| Takes | `motor/takes.sh` mapeia cada trecho falado com texto; escolhe o **último take** de cada fala | confere se precisar |
| Script de motion | tabela tempo · fala · modo (topo/cheio) · ação herói · peça | **aprova ou ajusta** |
| Construção | reaproveita peças prontas; sincroniza cada ação NA palavra | nada |
| Conferência | folha de quadros contra o **checklist "cara de premium"** + área segura + nada sobreposto | nada |
| Prévia | Remotion Studio no navegador | assiste e comenta |
| Render | `.mp4` pronto (ou `.mov` com transparência no modo overlay) | **aprova** |
| Aprendizado | o que você elogiou/reprovou vai pro seu `MEMORY.md` | nada |

**Dois modos:** *editado inteiro* (padrão, entrega o reels pronto) e *overlay* (só o motion por cima, com transparência, pra você juntar no seu editor).

---

## As regras de design (por que o resultado parece caro)
Resumo da `skill/motion-designer/referencias/doutrina-movimento.md`, leitura obrigatória da skill:
- **Real, não símbolo:** a cena mostra a interface de verdade (app, post, comentário, repositório) com dados reais. Blocos coloridos representando a ideia deixam tudo genérico.
- **Uma ação herói por cena**, com o elemento grande. **Uma cor de destaque só** (a da marca do assunto).
- **Vidro só na camada de controle** (barra, notificação, etiqueta de cursor). O conteúdo é sólido, com sombra macia.
- **Mola física** (resposta + amortecimento, como a Apple descreve) em vez de curvas prontas.
- **Câmera com intenção:** zoom de 1,06 a 1,15 no ponto da ação, sempre dentro da **área segura do Reels** (~90px nas laterais).
- **Frases palavra por palavra** entre os atos, com desfoque. **Toda cena sai com desfoque.** Tudo flutua de leve.
- **Continuidade:** a mesma peça atravessa cenas (a janela cresce, vira outra coisa).
- **Números rolam em degraus** quando o trecho é curto.
- **Toda ferramenta citada aparece com a logo oficial.** O mascote do Claude (Clawd) só no gancho.
- **Som só de interface** (clique, pop, digitação), baixo. Nada de laser ou whoosh, que brigam com a trilha.
- **Fontes livres:** Geist no texto, Inter Tight nos números (a SF Pro não pode sair de app da Apple).

Mais detalhe: `referencias/apple-hig-para-motion.md` (Human Interface Guidelines destiladas pra motion).

---

## Mapa do repositório
```
skill/motion-designer/      a skill (o que o Claude lê)
  SKILL.md                  gatilhos, fluxo, regras
  CLAUDE.md                 arquitetura, peças, pegadinhas
  referencias/              doutrina, Apple HIG, formatos, brandings, som, logos, onboarding
  motor/                    takes.sh · preparar.py · transcrever.sh · folha.sh · render.sh · demo.sh
  perfil.exemplo.md         modelo do seu perfil (o seu, perfil.md, é pessoal)
  MEMORY.exemplo.md         modelo da sua memória (a sua, MEMORY.md, é pessoal)
studio/                     motor de vídeo (Remotion)
  src/ds/                   design system: movimento (molas), brandings, fontes, som, formatos
  src/primitivas/           peças: Celular, Palco, CenaTexto, Cursor, Check, Marca, Logo, IconeApp, Clawd...
  src/edicao/               edição de bruto: ReelsEditado, Camera, Legendas, TelaCheia
  src/acervo/_modelos/      modelos pra copiar (modelo-editado, modelo-reels)
  src/acervo/demo-app/      exemplo completo premium (app fictício "mundi")
COLABORACAO.md              como mandar e receber melhorias no time
CHANGELOG.md                histórico de versões
instalar.sh                 instalação
```

## Colaboração
Diga pro Claude **"manda essa melhoria pro <nome>"** e ele abre um PR com o que mudou, o porquê e como testar. Diga **"o que o <nome> mandou?"** e ele resume, testa e só faz merge com o seu OK. O que é pessoal (perfil, memória, brutos) nunca sai da sua máquina. Detalhes: [`COLABORACAO.md`](COLABORACAO.md).

## Créditos e licenças de terceiros
- [Remotion](https://remotion.dev) (tem licença própria: gratuita pra indivíduos e empresas pequenas; confira antes de uso em empresa maior).
- Logos: [@lobehub/icons](https://github.com/lobehub/lobe-icons) (MIT); logo do HyperFrames do [repositório oficial](https://github.com/heygen-com/hyperframes). Logos são marcas dos donos; uso editorial.
- Sons: [Mixkit](https://mixkit.co/license/#sfxFree) (uso comercial liberado). Baixados na sua máquina pelo `instalar.sh`, não redistribuídos aqui.
- Fontes: Geist (OFL), Inter Tight (OFL), via Google Fonts.
- Clawd é mascote da Anthropic (Claude Code); uso editorial, sem sugerir parceria.
- Transcrição: [whisper.cpp](https://github.com/ggerganov/whisper.cpp) (MIT).
