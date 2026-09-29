# Formatos, saída e ficha do acervo

| Formato | Tamanho | Uso | Saída |
|---|---|---|---|
| reels · **editado inteiro** | 1080x1920; painel de motion 0-900px, câmera deslocada +300px embaixo | a skill entrega o reels pronto (cortes + câmera + motion + legenda + SFX) | `.mp4` (id da composição com "Editado") |
| reels · topo (overlay) | 1080x1920, painel 1080x810 no topo | só o motion, o criador junta no editor dele | `.mov` ProRes 4444 com alfa |
| reels · cheio | 1080x1920 inteiro | animação que pede espaço; narração por cima | dentro da mesma composição (troca com mola) |
| horizontal | 1920x1080 | YouTube, publi, comercial | `.mp4` H.264 |

- **Editado inteiro:** `<ReelsEditado>` (ver `studio/src/acervo/_modelos/modelo-editado/`). Duração = soma dos takes escolhidos. Até 2 `<TelaCheia>` por reels.
- **Overlay:** `<Reels trocas=[{f, modo}]>`; a composição tem a DURAÇÃO EXATA do vídeo gravado (frames = segundos × 30), motion posicionado pelos tempos da transcrição. O criador arrasta o `.mov` por cima, alinhado no início.
- **Área segura do Reels:** o Instagram corta as bordas. Nada importante a menos de ~90px das laterais nem colado no topo; conteúdo largo até ~840px no painel de 1080; o zoom também respeita isso.

## Modelo de ficha (na pasta de acervo definida no `perfil.md`)
```
---
type: motion
status: rascunho | aprovado
updated: YYYY-MM-DD
formato: reels-editado | reels-topo | horizontal
duracao: Xs
branding: apple | creme | ...
codigo: studio/src/acervo/<topico>/<slug>/
---
# <Nome>
**Caso de uso:** (genérico, pra achar de novo: "mostrar troca entre ferramentas", "ação única num app"...)
**Roteiro de motion:** ...
**Peças reaproveitáveis:** ...
**O que o criador achou:** ...
```
E uma linha no catálogo do acervo.
