# Colaboração: como o time troca melhorias da skill

Cada criador tem a skill instalada na própria máquina, ligada a este repositório. A regra de ouro:

| Compartilhado (vai pro Git) | Pessoal (nunca vai) |
|---|---|
| `skill/motion-designer/SKILL.md`, `CLAUDE.md`, `referencias/*` (doutrina, som, formatos...) | `perfil.md` (como VOCÊ trabalha) |
| `skill/motion-designer/motor/*` (scripts) | `MEMORY.md` (o SEU gosto, aprovações e reprovações) |
| `studio/src/**` (primitivas, edição, brandings, modelos, acervo de demonstração) | `HANDOFF.md` (retomada do seu trabalho) |
| `README.md`, `COLABORACAO.md`, `CHANGELOG.md`, `instalar.sh` | `studio/public/brutos`, `edicoes`, `pessoal`, `studio/src/acervo/pessoal/`, renders |

O `.gitignore` já trava o lado pessoal. Mesmo assim, antes de mandar, a skill confere se nada pessoal (nome de cliente, rosto, número, chave, caminho da sua máquina) entrou em arquivo compartilhado.

## "Manda pro <nome>" / "manda essa melhoria pro time"
O que a skill faz:
1. `git status` e `git diff`: lista o que mudou e separa compartilhável x pessoal. Se a melhoria nasceu de uma preferência sua que vale pra todos, **reescreve de forma genérica** na doutrina (sem seu nome, sem cliente).
2. `git switch -c <seu-nome>/<assunto-curto>` (ex.: `max/trilha-e-mixagem`).
3. Testa: `npx tsc --noEmit -p studio` + folha da demo (`motor/folha.sh ModeloEditado ...`).
4. Commit com mensagem clara em português + `git push -u origin <branch>`.
5. Abre o PR (`gh pr create`) preenchendo o template:
   - **O que mudou** (arquivos/peças)
   - **Por quê** (o que ficou melhor; antes e depois em imagem da folha, sem rosto de terceiros)
   - **Como testar** (comando + composição + frames)
   - **Regras novas pra doutrina** (se houver)
   - **Afeta o quê** (quebra algo existente? precisa rodar `instalar.sh` de novo?)
6. Entrega o link do PR pra você mandar pro colega (ou ele recebe o aviso do GitHub).

## "O que o <nome> mandou?" / "puxa a atualização"
1. `gh pr list` + `gh pr view <n>`: resume cada PR em linguagem simples (o que muda no SEU vídeo).
2. `gh pr checkout <n>`, testa (tipos + folha da demo) e mostra a folha.
3. Só com o seu OK: `gh pr merge <n> --squash` e `git switch main && git pull`.
4. Se o PR trouxe regra nova de doutrina, avisa em 1 linha o que muda no seu fluxo.
5. Se mexeu em dependência ou nos sons/logos: roda `./instalar.sh` de novo.

## Tipos de troca comuns
- **Trilha sonora e mixagem:** a lógica vai em `studio/src/ds/` (ex.: volume da trilha por baixo da voz, ducking) + regra em `referencias/som.md`. **Arquivos de música não vão pro Git** (licença): mande a lista com link e licença, e cada um baixa.
- **Primitiva nova** (ex.: tela do GitHub com estrelas animadas): `studio/src/primitivas/<Nome>.tsx` genérica + linha na tabela do `CLAUDE.md`.
- **Regra de qualidade** ("isso ficou genérico por causa X"): parágrafo em `doutrina-movimento.md` > Regras aprendidas.
- **Branding novo:** arquivo em `studio/src/ds/brandings/` (sem logo nem fonte licenciada de marca real).

## Versões
`CHANGELOG.md` registra cada merge em uma linha (data · autor · o que mudou). O `main` é sempre a versão estável.
