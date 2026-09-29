# Como a skill aprende

## Quando o criador manda uma referência de motion (link ou arquivo)
1. Baixar (`yt-dlp --cookies-from-browser <navegador> <url>`) ou usar o arquivo.
2. Folha de contato: `ffmpeg -i v.mp4 -vf "fps=1,scale=480:-1,tile=5x6" folha.jpg`; no trecho bom, 2 a 4 fps.
3. Descrever o MOVIMENTO (não o visual): o que entra, de onde, com que curva, quanto tempo, o que a câmera faz, como as cenas se ligam.
4. Decidir: vira regra na `doutrina-movimento.md`, primitiva nova em `studio/src/primitivas/`, ou branding novo.
5. Registrar a referência no `MEMORY.md` (link + o que foi extraído).
Nunca copiar marca, logo ou fonte licenciada da referência; copiar a gramática.

## Quando o criador avalia um motion
- Elogio: `MEMORY.md` > Acertos, com o que exatamente agradou.
- Crítica: `MEMORY.md` > Erros, com a correção aplicada, e ajustar a primitiva na origem (não só naquele motion).
- Decisão de padrão (branding, formato, som): `MEMORY.md` > Decisões + `perfil.md`.

## Pessoal x compartilhado (importante pra colaboração)
- `MEMORY.md` e `perfil.md` são **pessoais** (gosto e rotina de cada criador) e não vão pro Git.
- Quando um aprendizado vale pra QUALQUER criador (ex.: "número que rola em trecho curto = degraus"), ele sobe pra `doutrina-movimento.md` ou vira código/primitiva, e aí é compartilhado com o time (ver `COLABORACAO.md` na raiz).
