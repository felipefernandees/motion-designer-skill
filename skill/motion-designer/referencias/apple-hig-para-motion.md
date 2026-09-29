# HIG destilado para motion design de vídeo (Remotion)

> Fonte: 26 páginas da Human Interface Guidelines (JSON DocC oficial, versão com Liquid Glass, changelogs até set/2026). `loading-indicators.json` veio como HTML vazio (a Apple fundiu o tema em Progress indicators), então esse conteúdo sai de `progress-indicators`.
> Convenção: **[HIG]** = a Apple diz, com número dela. **[Tradução]** = inferência minha pra vídeo (CSS/Remotion), não está no HIG.
> Escala de conversão pra reel 1080x1920: um iPhone de 393 pt de largura ocupando a tela inteira dá **1 pt ≈ 2,75 px**. Usando o mockup de iPhone a ~85% da largura, **1 pt ≈ 2,3 px**. Todos os valores em pt abaixo multiplicam por esse fator.

---

## 1. Princípios de motion

**[HIG] O que a Apple manda**
- **Propósito:** motion serve à experiência, nunca aparece "porque sim". Animação gratuita distrai e pode causar desconforto físico.
- **Brevidade e precisão:** feedback curto e amarrado à ação comunica melhor do que animação chamativa. Exemplo deles: o panorama do Photos expande "rápido e suave" pra pessoa acompanhar a transição sem esperar.
- **Realismo físico:** o movimento segue o gesto e a expectativa. Se algo entrou deslizando de cima, sai pra cima, não pro lado. Movimento incoerente desorienta.
- **Interrompível:** nunca obrigar a esperar a animação terminar.
- **Pouca animação em interação frequente:** o que se repete muito precisa de motion quase invisível.
- **Não depender só de motion:** a informação também tem que estar no estado final (texto, cor, forma).
- **Liquid Glass reage ao toque** com mais ênfase (sensação tátil) e fica mais contido com trackpad.
- **Teto de duração:** Live Activities e widgets usam animações de **no máximo 2 s**.
- **Layout que muda:** preservar o máximo do layout existente e **mover os elementos pra nova posição** em vez de sumir e reaparecer. Em listas, só anima o item que muda de lugar; os outros fazem fade.
- **Evitar sobreposição** durante transição: se dois elementos vão colidir, um sai (fade) e reentra na nova posição.
- **Fade pra relocar:** se o deslocamento não comunica nada útil, faz fade out, move, fade in.
- **Oscilação contínua:** evitar principalmente perto de **0,2 Hz** (a faixa mais enjoativa); se precisar oscilar, amplitude baixa.
- **Periferia:** motion na borda do campo visual incomoda mais; objetos grandes em movimento ficam mais confortáveis com mais translucidez ou menos contraste.
- **Referencial fixo:** movimento dentro de uma área parada é mais confortável do que a cena inteira andando.
- **Frame rate:** 30 a 60 fps estáveis.
- **Easing:** no watchOS toda animação de layout tem easing embutido no início e no fim, não removível (ou seja: movimento linear não é "Apple").
- **Progresso:** indicador parado parece travado; mantenha sempre algo se mexendo. Ritmo de avanço uniforme (não mostrar 90% em 5 s e os 10% restantes em 5 min).
- **Não trocar spinner por barra** no meio (formas diferentes quebram a leitura). Pode trocar indeterminado por determinado na mesma forma.

**[Tradução] Regras de ouro pra vídeo**
1. Todo movimento tem causa visível (toque, dado novo, chegada de notificação). No reel, simule o "dedo" (círculo de toque 44 pt, opacidade 0,25) antes da reação.
2. Mola, nunca linear. Referência SwiftUI (fora do HIG): `.smooth` = 0,5 s sem bounce, `.snappy` = bounce 0,15, `.bouncy` = bounce 0,3. Em Remotion `spring()` com `mass: 1`: smooth `stiffness 158, damping 25`; snappy `stiffness 158, damping 21`; bouncy `stiffness 158, damping 18`. Fórmula: `stiffness = (2π/response)²`, `damping = 4π·dampingFraction/response`, com dampingFraction = 1 menos bounce.
3. Duração de micro feedback 0,2 a 0,35 s; transição de tela/sheet 0,4 a 0,55 s; nada acima de 2 s num elemento só.
4. Uma coisa principal se mexendo por vez. Secundários em fade curto (0,15 a 0,2 s).
5. Entrada e saída pelo mesmo eixo (sheet sobe de baixo e desce pra baixo; notificação desce do topo e sobe).
6. Continuidade de objeto: se o card vira tela cheia, é o mesmo retângulo crescendo (morph de raio, posição e tamanho), não um corte.

---

## 2. Liquid Glass e materiais

**[HIG] O que é**
- Material dinâmico que forma uma **camada funcional própria** (controles e navegação: tab bar, toolbar, sidebar, botões) **flutuando acima da camada de conteúdo**. O conteúdo rola e "espia" por baixo.
- **Sem cor própria:** pega a cor do que está atrás. Pode ser tingido ("vidro colorido") pra destacar a ação primária; é assim que o botão prominent (ex.: Done) funciona: **a cor vai no fundo do vidro, não no ícone/texto**.
- Elementos pequenos (toolbar, tab bar) alternam entre aparência clara e escura conforme o conteúdo por baixo; símbolos e texto ficam monocromáticos (escurecem sobre conteúdo claro, clareiam sobre escuro). Elementos grandes (sidebar) ficam **mais opacos**.
- Ícones de app ganham atributos de Liquid Glass: **realce especular, refração e translucidez**, e o sistema aplica sombras e brilhos (não desenhar isso no ícone).
- Usar Liquid Glass **com parcimônia**, só nos elementos funcionais mais importantes.

**[HIG] Variantes**
| Variante | Como é | Quando |
|---|---|---|
| **Regular** | Desfoca e ajusta a luminosidade do fundo pra garantir leitura. Padrão da maioria dos componentes | Fundo que atrapalha leitura, componentes com muito texto (alerts, sidebars, popovers) |
| **Clear** | Muito translúcido, prioriza ver o conteúdo atrás | Só sobre fundo visualmente rico (foto, vídeo). Se o fundo for claro, **camada de escurecimento preta a 35%** atrás do componente; se já for escuro, dispensa |

**[HIG] Regras de camada**
- **Nunca Liquid Glass na camada de conteúdo.** Conteúdo usa os materiais padrão. Exceção: slider/toggle viram vidro **só enquanto são arrastados**.
- Não empilhar vidro colorido em vários controles; **só um** com cor de fundo por grupo.
- Em vez de fundo sólido embaixo de controles, usar **scroll edge effect** (desfoque + queda de opacidade do conteúdo na borda).
- Conteúdo de fundo em tela cheia **estende por baixo** de tab bar e toolbar. Se a barra lateral cobre a imagem, o sistema **espelha e desfoca** a imagem por baixo dela (background extension).
- Em repouso (topo da tela), garantir legibilidade: nada de cor parecida entre controle e conteúdo.

**[HIG] Materiais padrão do iOS (camada de conteúdo):** `ultraThin`, `thin`, `regular` (padrão), `thick`. Mais grosso = mais opaco e mais contraste pra texto fino; mais fino = mais contexto do fundo. Pelas ilustrações: ultraThin é gradiente difuso das cores de fundo; thin, difuso e levemente escurecido; regular, difuso e escurecido; thick, escuro e apagado. Sobre material, usar **cores vibrantes** (label, secondary, tertiary; evitar quaternary sobre thin/ultraThin).

**[Tradução] Liquid Glass em CSS pra vídeo**
```css
/* Regular, sobre conteúdo claro */
.glass {
  background: rgba(255,255,255,0.18);
  backdrop-filter: blur(16px) saturate(180%) brightness(1.05);
  border-radius: 9999px;                       /* cápsula é a forma nativa */
  border: 1px solid rgba(255,255,255,0.45);   /* borda clara */
  box-shadow:
    inset 0 1px 0.5px rgba(255,255,255,0.75),  /* especular no topo */
    inset 0 -1px 1px rgba(0,0,0,0.06),         /* base mais densa */
    0 8px 24px rgba(0,0,0,0.12),               /* sombra de elevação */
    0 1px 2px rgba(0,0,0,0.08);
}
/* reflexo: pseudo-elemento com gradiente diagonal */
.glass::before {
  content:""; position:absolute; inset:0; border-radius:inherit; pointer-events:none;
  background: linear-gradient(135deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0) 38%,
              rgba(255,255,255,0) 70%, rgba(255,255,255,0.18) 100%);
  mix-blend-mode: screen;
}
```
- **Clear:** `background: rgba(255,255,255,0.06)`, `blur(6px) saturate(150%)`, mesma borda e especular, e uma div preta a 35% atrás se o vídeo de fundo for claro.
- **Regular em dark:** `background: rgba(30,30,32,0.45)`, borda `rgba(255,255,255,0.18)`, especular `rgba(255,255,255,0.35)`.
- **Tingido (botão primário):** fundo `rgba(accent, 0.85)` + mesmo especular; ícone branco.
- **Refração** (a lente curva nas bordas): em Chromium dá pra usar `backdrop-filter: url(#lens)` com `feDisplacementMap` só num anel de 6 a 10 px na borda. Caro no render; use em 1 elemento herói.
- **Materiais padrão aproximados:** ultraThin `blur 20px, bg α 0,30`; thin `blur 24px, α 0,45`; regular `blur 30px, α 0,60`; thick `blur 40px, α 0,75` (branco no light, `#1C1C1E` no dark).
- **Motion do vidro:** ao "tocar", scale 1 para 1,04 a 1,08 com mola bouncy e o especular acompanha; ao soltar, volta com mola smooth. Morph entre formas (cápsula vira menu) é o gesto mais "Liquid Glass" possível.
- **Performance Remotion:** backdrop-filter em muitas camadas deixa o render lento; limite a 2 a 4 elementos de vidro por frame e pré-desfoque o fundo quando ele for estático.

---

## 3. Tipografia

**[HIG] Básico**
- Fonte do sistema no iOS: **SF Pro** (variável, com tamanho óptico dinâmico entre Text e Display). Serifa: **New York**. Arredondada: **SF Pro Rounded**.
- **Tamanho padrão 17 pt, mínimo 11 pt** no iOS (macOS 13/10, tvOS 29/23, visionOS 17/12, watchOS 16/12).
- **Pesos recomendados:** Regular, Medium, Semibold, Bold. **Evitar Ultralight, Thin e Light**, sobretudo em texto pequeno. Peso enfatizado dos estilos: medium, semibold, bold ou heavy.
- Poucas famílias por interface. Hierarquia por peso, tamanho e cor.
- Live Activities: texto grande e **peso Medium ou mais**.
- Widgets: nada abaixo de 11 pt.
- Títulos de toolbar com **menos de 15 caracteres**.

**[HIG] Text styles do iOS, tamanho Large (padrão)**
| Estilo | Peso | Tamanho (pt) | Leading (pt) | Peso enfatizado |
|---|---|---|---|---|
| Large Title | Regular | 34 | 41 | Bold |
| Title 1 | Regular | 28 | 34 | Bold |
| Title 2 | Regular | 22 | 28 | Bold |
| Title 3 | Regular | 20 | 25 | Semibold |
| Headline | Semibold | 17 | 22 | Semibold |
| Body | Regular | 17 | 22 | Semibold |
| Callout | Regular | 16 | 21 | Semibold |
| Subhead | Regular | 15 | 20 | Semibold |
| Footnote | Regular | 13 | 18 | Semibold |
| Caption 1 | Regular | 12 | 16 | Semibold |
| Caption 2 | Regular | 11 | 13 | Semibold |

Faixa Dynamic Type (Large Title / Body): xSmall 31/14, Small 32/15, Medium 33/16, **Large 34/17**, xLarge 36/19, xxLarge 38/21, xxxLarge 40/23. Pra vídeo, **xxxLarge é ótimo**: Large Title 40/48, Title 1 34/41, Title 2 28/34, Title 3 26/32, Headline e Body 23/29, Callout 22/28, Subhead 21/28, Footnote 19/24, Caption 1 18/23, Caption 2 17/22. Leading típico ≈ 1,2 a 1,3x o tamanho.

**[HIG] Tracking do SF Pro (iOS), 1/1000 em**
| pt | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 20 | 22 | 24 | 28 | 34 | 40 | 48 | 60 | 72 | 80+ |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| em/1000 | +6 | 0 | -6 | -11 | -16 | -20 | -26 | -23 | -12 | +3 | +14 | +12 | +10 | +8 | +4 | +2 | 0 |
| pt | +0,06 | 0 | -0,08 | -0,15 | -0,23 | -0,31 | -0,43 | -0,45 | -0,26 | +0,07 | +0,38 | +0,40 | +0,37 | +0,35 | +0,26 | +0,14 | 0 |
Abaixo de 11 fica cada vez mais aberto (6 pt = +41). Leitura: o texto de corpo (13 a 22) é **apertado**; em 24+ o SF Pro troca pro corte Display e o tracking volta a ser levemente positivo.

**[Tradução] Pra vídeo**
- Esses números valem **para o SF Pro**. Com **Inter** (variável, eixo `opsz` ligado com `font-optical-sizing: auto`) os cortes Display do Inter são mais largos que o SF Display, então a regra prática vira: 11 a 12 px **+0,005 em**; 13 a 16 **0**; 17 a 22 **-0,01 em**; 24 a 40 **-0,02 em**; 48 a 72 **-0,025 em**; 80+ **-0,03 em**. Números sempre com `font-variant-numeric: tabular-nums` quando animam.
- Em reel, o "Body" vira no mínimo 17 pt x 2,3 = **~40 px**; título de destaque 64 a 96 px Semibold/Bold.
- Hierarquia só com 3 níveis visíveis por cena: título (Bold), texto (Regular/Medium), meta (secondaryLabel).
- SF Pro não pode ser embarcado fora de app Apple (licença); por isso Inter. Alternativas próximas: Geist, SF-like "Inter Tight" pra títulos.

---

## 4. Cor

**[HIG] System colors iOS (RGB), padrão e alto contraste**
| Cor | Light | Dark | Alto contraste light | Alto contraste dark |
|---|---|---|---|---|
| Red | 255,56,60 `#FF383C` | 255,66,69 `#FF4245` | 233,21,45 | 255,97,101 |
| Orange | 255,141,40 `#FF8D28` | 255,146,48 `#FF9230` | 197,83,0 | 255,160,86 |
| Yellow | 255,204,0 `#FFCC00` | 255,214,0 `#FFD600` | 161,106,0 | 254,223,67 |
| Green | 52,199,89 `#34C759` | 48,209,88 `#30D158` | 0,137,50 | 74,217,104 |
| Mint | 0,200,179 `#00C8B3` | 0,218,195 `#00DAC3` | 0,133,117 | 84,223,203 |
| Teal | 0,195,208 `#00C3D0` | 0,210,224 `#00D2E0` | 0,129,152 | 59,221,236 |
| Cyan | 0,192,232 `#00C0E8` | 60,211,254 `#3CD3FE` | 0,126,174 | 109,217,255 |
| Blue | 0,136,255 `#0088FF` | 0,145,255 `#0091FF` | 30,110,244 | 92,184,255 |
| Indigo | 97,85,245 `#6155F5` | 109,124,255 `#6D7CFF` | 86,74,222 | 167,170,255 |
| Purple | 203,48,224 `#CB30E0` | 219,52,242 `#DB34F2` | 176,47,194 | 234,141,255 |
| Pink | 255,45,85 `#FF2D55` | 255,55,95 `#FF375F` | 231,18,77 | 255,138,196 |
| Brown | 172,127,94 `#AC7F5E` | 183,138,102 `#B78A66` | 149,109,81 | 219,166,121 |

**[HIG] Cinzas do iOS**
| | Light | Dark |
|---|---|---|
| systemGray | `#8E8E93` | `#8E8E93` |
| systemGray2 | `#AEAEB2` | `#636366` |
| systemGray3 | `#C7C7CC` | `#48484A` |
| systemGray4 | `#D1D1D6` | `#3A3A3C` |
| systemGray5 | `#E5E5EA` | `#2C2C2E` |
| systemGray6 | `#F2F2F7` | `#1C1C1E` |

**[HIG] Backgrounds e labels (semântica)**
- Dois conjuntos: **system** (`systemBackground`, `secondary`, `tertiary`) e **grouped** (listas agrupadas). Primary = tela; secondary = agrupar dentro da tela; tertiary = agrupar dentro do secundário.
- No dark há **base** (mais escuro, recua) e **elevated** (mais claro, avança): sheet e popover sobem pra elevated. **Dark não é inversão** do light.
- Labels: `label`, `secondaryLabel`, `tertiaryLabel`, `quaternaryLabel` (contraste decrescente).
- Valores (referência UIKit, não constam no HIG): background light `#FFFFFF` / `#F2F2F7` / `#FFFFFF`; grouped light `#F2F2F7` / `#FFFFFF` / `#F2F2F7`; dark base `#000000` / `#1C1C1E` / `#2C2C2E`; dark elevated `#1C1C1E` / `#2C2C2E` / `#3A3A3C`. Labels light: `#000`, `rgba(60,60,67,.60)`, `rgba(60,60,67,.30)`, `rgba(60,60,67,.18)`; dark: `#FFF`, `rgba(235,235,245,.60)`, `rgba(235,235,245,.30)`, `rgba(235,235,245,.16)`. Separator: `rgba(60,60,67,.29)` light, `rgba(84,84,88,.60)` dark.

**[HIG] Regras de uso**
- Uma cor = um significado. Não usar a cor de "interativo" em texto não interativo.
- **Accent com parcimônia:** ações primárias e indicadores de status; nunca em todos os controles.
- Fundo colorido pede barras monocromáticas; conteúdo monocromático aceita a cor da marca como accent.
- Nunca só cor pra informar (texto ou forma junto). Cor muda de sentido por cultura (vermelho = alta na bolsa da China).
- Contraste mínimo **4,5:1**, ideal **7:1** em texto pequeno.
- No dark, **escurecer levemente imagens com fundo branco** pra não "brilharem".
- Wide color: Display P3 dá cores mais saturadas; gradientes P3 podem estourar em sRGB (vídeo final é sRGB/Rec.709, então trabalhe em sRGB).
- Notificação no watch: fundo **branco a 18%** pra casar com as do sistema.
- Dynamic Island: fundo **preto opaco**; a marca entra via **cores fortes em texto e objetos**; key line (contorno) tingida no tom do conteúdo.

---

## 5. Layout

**[HIG] Números**
- Alvo mínimo de toque **44x44 pt** (visionOS 60x60, centros a 60 pt; +4 pt de respiro em botões 60+).
- Margem padrão de widget **16 pt**; margem apertada pra grupos/fundos **11 pt**.
- Margem padrão de Live Activity na Lock Screen **14 pt**.
- Dynamic Island: raio **44 pt**, altura compacta **36,67 pt**, largura compacta/minimal **230 pt** (Pro/base) ou **250 pt** (Pro Max/Plus/Air); expandida **371 ou 408 pt de largura x 84 a 160 pt de altura**.
- Widgets iPhone 393x852: small **158x158**, medium **338x158**, large **338x354**, circular 72x72, rectangular 160x72, inline 234x26. Em 430x932: 170, 364x170, 364x382.
- Ícone de app: canvas 1024x1024, sistema aplica a máscara arredondada; conteúdo centrado.
- Imagem em ícone: ~80% do canvas, margem ~10%.
- Toolbar: no máximo **3 grupos**; uma ação primária só, no lado trailing.
- Submenu com mais de ~5 itens vira outro menu.

**[HIG] Concentricidade (corner concentricity)**
- Botões, campos, headers e footers padrão têm **raio concêntrico ao canto da barra**; componente custom tem que seguir.
- Live Activity: **margens iguais e posicionamento concêntrico**; um retângulo arredondado perto do canto usa o raio do canto externo **menos a margem**, pra não "espetar" a curva. Conteúdo compacto, junto, dentro de uma margem concêntrica à borda.
- Widget: raio do conteúdo coordenado com o do widget (`ContainerRelativeShape`).
- Ícones de app no iOS são arredondados na mesma curvatura dos outros elementos do sistema.
- Separar blocos com **container inset** ou **linha grossa**; nunca desenhar até a borda da Dynamic Island.
- **Fórmula:** `raio_interno = raio_externo - padding`. Ex.: card 28 com padding 12 dá botão 16; se der ≤ 0, use cápsula ou raio pequeno fixo.

**[HIG] Hierarquia e agrupamento**
- Importante no topo e no lado leading. Alinhamento = relação; indentação = subordinação.
- Agrupar com espaço negativo, forma de container ou separador.
- Progressive disclosure: mostrar o essencial, detalhe sob demanda.
- Controles distintos do conteúdo (Liquid Glass + scroll edge effect).
- Controles no meio e embaixo da tela (ergonomia de uma mão).

**[Tradução] Pra reel 1080x1920**
- Safe area do Instagram: topo ~220 px e base ~380 px ocupados pela UI do app; UI de mockup vive entre y 220 e y 1540.
- Grade de espaço em múltiplos de 4 pt (4, 8, 12, 16, 20, 24, 32) vezes 2,3 a 2,75.
- Um card herói por vez no centro óptico (um pouco acima do meio).

---

## 6. Componentes que valem ouro em motion

### Notificação (banner)
- **Anatomia [HIG]:** ícone grande do app no leading (em comunicação: foto do contato com mini ícone do app), título curto no topo (evento, assunto), corpo em frase completa, sentence case; o sistema trunca. Até **4 ações** no detalhe. Badge = oval vermelho com texto branco.
- **Cara de Apple [Tradução]:** desce do topo com mola snappy (0,45 s), cápsula/raio ~24 pt em material regular, leve overshoot de 2 a 4 pt; empilhamento com cards de trás em scale 0,94 e 0,88 e opacidade menor. Saída sobe pelo mesmo eixo. Badge entra com scale 0 para 1 bouncy.

### Live Activities e Dynamic Island
- **Anatomia [HIG]:** 4 apresentações: **compact** (dois pedaços colados à câmera, leading e trailing, lidos como uma informação só, mesma cor e tipografia, sem padding junto à câmera, larguras equilibradas); **minimal** (círculo ou oval quando há 2 atividades, mostra dado vivo, não só logo); **expanded** (ampliação previsível do compact, conteúdo abraçando a câmera); **Lock Screen** (banner na base, layout próprio, não copia notificação, margem 14 pt, altura dinâmica 84 a 160 pt). StandBy: 2x de escala. Logo **sem container**, nunca o ícone inteiro.
- **Animação [HIG]:** máx. **2 s**; content-replace padrão ou custom com **scale, opacidade e movimento**; **numeric content transition** em placar; elementos existentes **se movem** pra nova posição no expandir.
- **Cara de Apple [Tradução]:** a pílula preta morfa de 230x36,67 pt pra 371x160 pt mantendo cantos contínuos (raio = metade da altura no compact, ~44 pt no expanded), mola com leve bounce (0,15 a 0,2), conteúdo interno entra 80 a 120 ms depois com fade + blur 8 px para 0. Números rolando dígito a dígito (cada dígito desliza verticalmente com blur de movimento). Key line de 1 px na cor da marca quando o fundo é escuro.

### Widgets
- **Anatomia [HIG]:** small = uma informação; medium e large = camadas adicionais, não "small esticado". Margem 16 pt (11 pt pra grupos). Texto ≥ 11 pt. Aparências: light, dark, **clear** (dessaturado + translucidez + realces + Liquid Glass) e **tinted**. Placeholder = retângulos semi-opacos de larguras diferentes no lugar do texto.
- **Animação [HIG]:** transição de dado novo até **2 s**.
- **Cara de Apple [Tradução]:** skeleton (placeholder) resolvendo em conteúdo real com crossfade 0,3 s; número principal grande Semibold com contagem; gráfico sparkline desenhando da esquerda pra direita. Grade de widgets entrando em cascata (stagger 40 a 60 ms) com scale 0,92 para 1.

### Tab bar
- **Anatomia [HIG]:** flutua na base sobre Liquid Glass; ícone (SF Symbol, **variante fill**) + label de uma palavra; badge vermelho; aba de busca pode ficar no trailing; com acessório (MiniPlayer), ao rolar a barra **minimiza** e o acessório fica inline. Nunca esconder abas.
- **Cara de Apple [Tradução]:** cápsula de vidro com indicador de seleção que **desliza e estica** entre abas (mola snappy, a lente se alonga no meio do caminho e volta), ícone selecionado em accent, demais monocromáticos. Minimização ao rolar: a barra encolhe pra um círculo no canto leading em 0,4 s.

### Sheets
- **Anatomia [HIG]:** sobe de baixo; **detents medium e large**; **grabber** no topo; Cancel no leading, Done no trailing (nunca Cancel, Done e Back juntos); dispensa com swipe vertical; uma sheet por vez. Fundo sobe pra cor **elevated** no dark.
- **Cara de Apple [Tradução]:** entra com mola smooth 0,5 s até o detent medium; a tela de trás escurece (preto 20 a 30%) e recua scale 0,94 com cantos arredondando; expandir pra large é a mesma sheet crescendo. Cantos superiores ~38 pt.

### Menus
- **Anatomia [HIG]:** layouts small (fileira de 4 ícones no topo), medium (3 ícones com label curta) e large (lista, padrão). Itens importantes primeiro, grupos com separador, ícones em todos ou em nenhum do grupo, checkmark pra estado ativo, chevron pra submenu, reticências quando pede mais input.
- **Cara de Apple [Tradução]:** o botão de vidro **se transforma** no menu (morph a partir da origem do toque, scale de 0,6 para 1 ancorado no ponto de origem, bouncy leve), itens com stagger de 20 ms; o conteúdo atrás desfoca levemente.

### Botões
- **Anatomia [HIG]:** estilo + conteúdo (símbolo, texto ou ambos) + papel (normal, primary em accent, cancel, destructive em vermelho). **Sempre estado pressionado.** Diferenciar a escolha preferida por **estilo, não tamanho**. Primary nunca destrutivo. Pode conter spinner inline pra ação que demora. Preferir **cápsula ou círculo**; em pilha vertical, retângulo arredondado; em fileira horizontal, cápsula. Branco com texto preto é reservado pro estado "ligado".
- **Cara de Apple [Tradução]:** press = scale 0,96 com escurecimento 8%, release com mola bouncy; no Liquid Glass o press **aumenta** (1,04 a 1,08) e brilha. Transição texto para spinner para check (Replace).

### Progresso e loading
- **Anatomia [HIG]:** determinado (barra ou anel preenchendo) sempre que possível; indeterminado = spinner girando. Não trocar spinner por barra. Label específica, nunca "Carregando...". Refresh control aparece ao puxar.
- **Cara de Apple [Tradução]:** barra com trilho `systemGray5` e preenchimento accent com ponta arredondada, avanço em ritmo constante com micro acelerações; anel com `stroke-linecap: round` começando às 12h no sentido horário; finalização = anel fecha e vira check com Draw On. Spinner iOS = 8 traços com opacidade em degradê girando em passos (não rotação contínua suave).

### Gráficos (charts)
- **Anatomia [HIG]:** marks (barra = comparar categorias/partes; linha = variação no tempo; ponto = valores individuais/correlação; combinar linha + pontos quando ajuda). Eixo Y de barra começa em **zero**; faixa fixa quando o domínio tem limites (bateria 0 a 100%). Ticks em sequência familiar (0, 5, 10). Poucas grid lines. **Dado mais proeminente que eixos e textos.** Título que resume a mensagem principal. Separação visual entre áreas de cor contíguas (barras empilhadas). Animar mudanças pra serem notadas. Alinhar o leading do gráfico ao resto da tela.
- **Cara de Apple [Tradução]:** barras crescendo da base com stagger 30 ms e mola smooth; linha desenhando com `stroke-dashoffset` + área com gradiente accent 30% para 0%; valor destacado com ponto e "callout" em material; grid em `separator`, labels em Caption `secondaryLabel`.

### SF Symbols e animações de símbolo
- **[HIG] Modos de render:** monochrome, hierarchical (uma cor em opacidades por camada, ex.: 100/50/25%), palette (uma cor por camada), multicolor (cores intrínsecas). SF Symbols 7: **gradiente** linear gerado de uma cor. **Variable color** = camadas acendem por limiar de 0 a 100% (ex.: speaker.wave.3), serve pra mudança, não profundidade. 9 pesos casando com a fonte, 3 escalas (small, medium, large). Variantes outline (toolbar), **fill (tab bar, seleção)**, slash (indisponível), enclosed (legibilidade pequena).
- **[HIG] Animações:**
  - **Appear / Disappear:** surge ou some gradualmente.
  - **Bounce:** escala elástica curta pra cima ou pra baixo e volta; toca uma vez; "ação aconteceu".
  - **Scale:** muda de tamanho e **persiste** (seleção).
  - **Pulse:** varia **só opacidade** das camadas marcadas; atividade em andamento.
  - **Variable color:** acende camadas em sequência, **cumulativo** (vão ficando acesas) ou **iterativo** (uma por vez), com autoreverse; open loop vs closed loop (anel).
  - **Replace:** troca um símbolo por outro: **down-up** (sai encolhendo, entra crescendo: mudança de estado), **up-up** (ambos sobem: progressão), **off-up** (sai na hora, entra crescendo: próxima ação).
  - **Magic Replace:** transição inteligente entre formas relacionadas (slash desenha, badge aparece); é o padrão.
  - **Wiggle:** vai e vem num eixo; chamar atenção pra CTA.
  - **Breathe:** opacidade **e** tamanho, sensação de "vivo" (gravação).
  - **Rotate:** gira inteiro ou só uma camada (hélice do ventilador).
  - **Draw On / Draw Off:** desenha o traçado por pontos-guia, camadas juntas, em stagger ou uma a uma; progresso ou reforço de sentido (seta).
  - Usar com critério; cada animação tem significado próprio.
- **[Tradução] Pra vídeo:** SF Symbols só é permitido em mockup de interface Apple; em comercial use Lucide ou Phosphor e reproduza a **gramática**: Bounce = scaleY 1 para 0,85 para 1,08 para 1 em ~0,35 s; Pulse = opacidade 1 para 0,35 em loop de 1,2 s; Breathe = scale 1 para 1,08 + opacidade 1 para 0,7 em 1,6 s; Replace down-up = saída scale 1 para 0,6 + blur 4 px + fade, entrada 0,6 para 1 com bounce; Draw On = `stroke-dashoffset` com stagger por path; Variable color = camadas acendendo em sequência a cada 120 ms.

---

## 7. Receita de tokens para vídeo

```ts
// tokens.apple-video.ts  (base 1 pt = 2.5 px pra reel 1080x1920; ajuste PT)
export const PT = 2.5;
const pt = (n: number) => Math.round(n * PT);

export const accent = { light: "#0088FF", dark: "#0091FF" }; // troque aqui (1 cor só)

export const color = {
  light: {
    bg: "#FFFFFF", bg2: "#F2F2F7", bg3: "#FFFFFF",
    grouped: "#F2F2F7", groupedCard: "#FFFFFF",
    label: "#000000",
    label2: "rgba(60,60,67,0.60)", label3: "rgba(60,60,67,0.30)", label4: "rgba(60,60,67,0.18)",
    separator: "rgba(60,60,67,0.29)",
    fill: "rgba(120,120,128,0.20)", fill2: "rgba(120,120,128,0.16)",
    gray: ["#8E8E93", "#AEAEB2", "#C7C7CC", "#D1D1D6", "#E5E5EA", "#F2F2F7"],
    accent: accent.light, success: "#34C759", warning: "#FF8D28", danger: "#FF383C",
  },
  dark: {
    bg: "#000000", bg2: "#1C1C1E", bg3: "#2C2C2E",
    elevated: "#1C1C1E", elevated2: "#2C2C2E",
    label: "#FFFFFF",
    label2: "rgba(235,235,245,0.60)", label3: "rgba(235,235,245,0.30)", label4: "rgba(235,235,245,0.16)",
    separator: "rgba(84,84,88,0.60)",
    fill: "rgba(120,120,128,0.36)", fill2: "rgba(120,120,128,0.32)",
    gray: ["#8E8E93", "#636366", "#48484A", "#3A3A3C", "#2C2C2E", "#1C1C1E"],
    accent: accent.dark, success: "#30D158", warning: "#FF9230", danger: "#FF4245",
  },
  island: { bg: "#000000", keyline: "rgba(255,255,255,0.14)" },
  dimClearGlass: "rgba(0,0,0,0.35)",
};

export const radius = {
  xs: pt(6), sm: pt(10), md: pt(14), lg: pt(20), card: pt(24), sheet: pt(38),
  widget: pt(22), island: pt(44), capsule: 9999,
  concentric: (outer: number, padding: number) => Math.max(outer - padding, pt(4)),
};

export const space = { 1: pt(4), 2: pt(8), 3: pt(12), 4: pt(16), 5: pt(20), 6: pt(24), 8: pt(32),
  widgetMargin: pt(16), tightMargin: pt(11), liveActivityMargin: pt(14), hit: pt(44) };

export const shadow = {
  sm: "0 1px 2px rgba(0,0,0,0.08)",
  md: "0 4px 12px rgba(0,0,0,0.10), 0 1px 2px rgba(0,0,0,0.06)",
  lg: "0 12px 32px rgba(0,0,0,0.14), 0 2px 6px rgba(0,0,0,0.06)",
  float: "0 20px 48px rgba(0,0,0,0.18)",
};

export const glass = {
  regular: { background: "rgba(255,255,255,0.18)", backdropFilter: "blur(16px) saturate(180%)",
    border: "1px solid rgba(255,255,255,0.45)",
    boxShadow: "inset 0 1px 0.5px rgba(255,255,255,0.75), inset 0 -1px 1px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.12)" },
  regularDark: { background: "rgba(30,30,32,0.45)", backdropFilter: "blur(16px) saturate(160%)",
    border: "1px solid rgba(255,255,255,0.18)",
    boxShadow: "inset 0 1px 0.5px rgba(255,255,255,0.35), 0 8px 24px rgba(0,0,0,0.30)" },
  clear: { background: "rgba(255,255,255,0.06)", backdropFilter: "blur(6px) saturate(150%)",
    border: "1px solid rgba(255,255,255,0.40)",
    boxShadow: "inset 0 1px 0.5px rgba(255,255,255,0.70), 0 6px 18px rgba(0,0,0,0.10)" },
  tinted: (hex: string) => ({ background: hex, border: "1px solid rgba(255,255,255,0.35)",
    boxShadow: "inset 0 1px 0.5px rgba(255,255,255,0.6), 0 8px 24px rgba(0,0,0,0.15)" }),
  sheen: "linear-gradient(135deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0) 38%, rgba(255,255,255,0) 70%, rgba(255,255,255,0.18) 100%)",
  material: { ultraThin: [20, 0.30], thin: [24, 0.45], regular: [30, 0.60], thick: [40, 0.75] } as const, // [blur px, alpha]
};

// Inter variável com optical sizing; tracking adaptado ao Inter (SF Pro tem tabela própria)
export const font = { family: "'Inter', system-ui, sans-serif", featureNumbers: "tnum" };
export const tracking = (px: number) => {
  const p = px / PT;
  if (p <= 12) return "0.005em"; if (p <= 16) return "0em"; if (p <= 22) return "-0.01em";
  if (p <= 40) return "-0.02em"; if (p <= 72) return "-0.025em"; return "-0.03em";
};
const t = (size: number, lead: number, weight: number) =>
  ({ fontSize: pt(size), lineHeight: `${pt(lead)}px`, fontWeight: weight, letterSpacing: tracking(pt(size)) });
export const text = { // base xxxLarge do iOS: legível em reel
  hero: t(56, 62, 700), largeTitle: t(40, 48, 700), title1: t(34, 41, 700), title2: t(28, 34, 700),
  title3: t(26, 32, 600), headline: t(23, 29, 600), body: t(23, 29, 400), callout: t(22, 28, 400),
  subhead: t(21, 28, 400), footnote: t(19, 24, 400), caption1: t(18, 23, 500), caption2: t(17, 22, 500),
};

export const motion = { // Remotion spring configs (mass 1)
  smooth: { stiffness: 158, damping: 25 },   // 0,5 s sem bounce: sheets, morph, layout
  snappy: { stiffness: 158, damping: 21 },   // bounce 0,15: notificação, tab indicator
  bouncy: { stiffness: 158, damping: 18 },   // bounce 0,3: press de vidro, badge, symbol bounce
  quick:  { stiffness: 400, damping: 40 },   // micro feedback ~0,3 s
  fadeMs: 180, staggerMs: 40, maxElementMs: 2000, pressScale: 0.96, glassPressScale: 1.06,
};
```

Checklist final de "cara de Apple": mola em vez de linear; uma ação herói por cena; accent só na ação primária; cantos concêntricos; vidro só na camada de controle; números tabulares que rolam; nada abaixo de 11 pt (x fator); contraste 4,5:1 no mínimo; elemento que muda de lugar se move, não pisca.
