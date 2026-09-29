# Brandings de motion

Registro em `studio/src/ds/brandings/index.ts`. `PADRAO` = o que usar quando o criador não disser (definido no `perfil.md`; o padrão de fábrica é `apple`, claro).

| Nome | Visual | Fontes | Quando |
|---|---|---|---|
| `apple` (arquivo `geral.ts`) | off-white #F5F5F7, tinta #1D1D1F, 1 cor de destaque, vidro só em controle | Geist (texto) + Inter Tight (números/títulos) | padrão premium de reels (o que ficou melhor nos testes) |
| `creme` | creme quente #F3F1EC, marrom-café #2A140C, destaque vermelho | DM Sans + Bricolage Grotesque | clima editorial/quente |
| `mundi` | apple com vermelho iOS #FF383C | Inter | app fictício de demonstração (`src/acervo/demo-app/`) |

## Criar branding novo
1. Copiar `geral.ts`, trocar só o que muda (herdar com `...geral`).
2. Fonte: só Google Fonts (`@remotion/google-fonts/<Nome>`), carregada em `src/ds/fontes.ts`. Fonte de marca real é licenciada: nunca baixar da LP de referência, achar a equivalente livre.
3. Registrar em `index.ts` e numa linha desta tabela.
4. Branding de cliente/marca: tirar cor e clima da referência, nunca a logo nem a fonte licenciada.
5. **Cor de destaque = a da marca do ASSUNTO** do vídeo (laranja Claude #D97757 em vídeo de Claude). Uma só por vídeo.
