# Doutrina de movimento (o que faz o motion parecer caro)

Fontes: motion aprovado do app de demonstração "mundi" (`studio/src/acervo/demo-app/`, 2026-09-28), Designing Fluid Interfaces (Apple), HIG destilada (`apple-hig-para-motion.md`).

## Regras de ouro
1. **Mola, nunca linear.** Usar os presets de `M` em `src/ds/movimento.ts`:
   - `padrao` (0,45s, sem quique): mudança de estado, layout, troca de modo.
   - `entrada` (0,6s, 0,9): palco e aparelho chegando.
   - `chegada` (0,45s, 0,78): coisa que "chega" (notificação, cartão, ícone, menu).
   - `estalo` (0,3s, 0,62): check, ponto da marca, badge. Quique só onde houve "impacto".
   - `lento` (0,9s): câmera e fundos.
2. **Texto palavra por palavra:** cada palavra entra com opacidade + desfoque 16px→0 + subida 30px, 4 frames de atraso entre palavras, 16 frames de duração. 3 a 5 palavras, 1 linha, 1 palavra na cor de destaque (a que carrega o sentido).
3. **Câmera com intenção:** zoom de 1,14 a 1,2 no ponto onde a ação acontece (seletor, campo), volta a 1 antes da próxima ação fora do quadro. Nunca zoom sem motivo.
4. **Uma ação herói por cena.** O cursor só vai aonde a história precisa; clique = aperto 0,8 + onda na cor da marca.
5. **Número rola, não troca.** Valor muda com contagem (easing suave, dígitos tabulares) e pisca na cor de destaque.
6. **Elemento que muda de lugar se move**, não some e reaparece (empurrar notificações, carrossel deslizando).
7. **Saída com desfoque** (9 frames): a cena sai com blur + leve escala; a próxima entra limpa.
8. **Respiro:** fundo neutro, muito espaço vazio, raio generoso (cards 24 a 26, controles em cápsula, ícone 22,4%), sombra macia em duas camadas.
9. **Vidro só na camada de controle** (menu, notificação, barra). Conteúdo nunca é de vidro.
10. **Tudo flutua de leve** (seno de 5px no aparelho). Parado demais parece print.

## Ritmo
- Frase: ~42 frames. Cena de app: 150 a 190 frames. Marca: ~70 frames.
- Reels sincronizado: a ação da tela acontece NA palavra que ela ilustra (±3 frames). A palavra de destaque da CenaTexto entra quando ele fala essa palavra.

## Checklist antes de renderizar
- [ ] Nenhum texto menor que ~28px no reels (lido no celular) e ~14px dentro do aparelho escalado.
- [ ] Nada do modo topo invade a faixa de baixo.
- [ ] Uma cor de destaque só, usada no que importa.
- [ ] Toda entrada tem saída; nada corta seco.
- [ ] Folha de frames conferida.

## Checklist "cara de premium" (obrigatório na folha, antes de mostrar)
Nasceu da comparação entre um motion premium (demo "mundi") e um reels editado que ficou genérico (2026-09-28).
- [ ] **Real, não símbolo:** a cena mostra uma interface crível (celular, app, editor, post, DM do Instagram, tela do GitHub/X) com dados reais, e não blocos coloridos/slots vazios/fios representando a ideia.
- [ ] **Uma ação herói por cena**, com o elemento GRANDE ocupando o quadro. Se tem 4 coisas pequenas se mexendo, cortar.
- [ ] **Uma cor de destaque só** (a da marca do assunto: laranja Claude em vídeo de Claude). Nada de amarelo + verde + ciano juntos.
- [ ] **Vidro só na camada de controle** (menu, notificação, barra, cursor-tag). Card de conteúdo é sólido com sombra macia.
- [ ] **Mola física** (`M` em `ds/movimento.ts`), nunca ease pronto que imita mola (back/elastic).
- [ ] **Câmera 1,14 a 1,2 no ponto da ação**, volta a 1 antes da próxima.
- [ ] **Frase palavra por palavra entre os atos** (CenaTexto), com 1 palavra no destaque.
- [ ] **Toda cena sai com desfoque**; nada corta seco. **Tudo flutua de leve.**
- [ ] Nada sobreposto, nada descentralizado, fio/conector só depois do que ele liga, câmera do criador até o último frame.

## Regras aprendidas em produção (valem pra qualquer criador)
Edição
- **Take certo = o ÚLTIMO de cada fala** repetida (salvo o criador mandar "usa a última / logo após"). Murmúrio ensaiando a próxima fala NÃO é take. Mapear com `motor/takes.sh` e ouvir na dúvida.
- A câmera vai até o último frame da composição (o último corte estica a imagem; o som para no fim da fala).
- Legenda: 2 a 3 palavras, minúscula, sem caixa, com sombra; altura variável (divisa / peito / embaixo na tela cheia); escura quando o fundo é claro.
Visual
- **Interface real e FIEL** em vez de símbolo: se a fala cita o Instagram, é a folha de comentários de verdade (alça, título, avatar, nome, tempo, "Responder", coração, barra de emojis, campo com a foto de quem comenta, botão de enviar); se cita um app, a janela dele; se cita um número ("27 mil estrelas"), a tela onde esse número vive.
- A MESMA peça atravessa cenas (continuidade): a janela do editor cresce pra tela cheia; a janela do Claude Code vira a barra de render.
- Misturar dois motions ao mesmo tempo é bom quando contam a mesma história (o arquivo sendo arrastado + a duração caindo embaixo).
- Ação de arrastar precisa de ≥1,2s pra ser vista.
- Número que rola em trecho curto = **degraus** (cada valor entra e para), nunca rolagem contínua. Conferir quanto tempo existe entre as palavras antes de animar.
- **Área segura:** ~90px das laterais, nada colado no topo; zoom também respeita.
- Toda ferramenta citada = logo oficial. Mascote só no gancho.
Som
- Só som de interface, baixo (ver `som.md`).
