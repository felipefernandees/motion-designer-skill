# Brandings de motion

Registro em `studio/src/ds/brandings/index.ts`. `PADRAO` = o que usar quando o criador não disser (definido no `perfil.md`; o padrão de fábrica é `apple`, claro).

**Branding é pessoal.** No repositório vai só o neutro `apple`. Os de cada criador moram em `studio/src/ds/brandings/pessoais/<nome>.ts` (fora do Git) e são carregados sozinhos, sem registrar em lugar nenhum. Liste os seus no `perfil.md`.

| Nome | Visual | Fontes | Onde |
|---|---|---|---|
| `apple` (arquivo `geral.ts`) | off-white #F5F5F7, tinta #1D1D1F, 1 cor de destaque, vidro só em controle | Geist (texto) + Inter Tight (números/títulos) | repositório (padrão de fábrica) |
| `mundi` | apple com vermelho iOS #FF383C | Inter | marca do app fictício da demo, mora em `src/acervo/demo-app/mundi-completo/branding.ts` |

## Criar branding novo
1. Criar `pessoais/<nome>.ts` herdando o neutro (`...geral`) e trocando só o que muda (modelo em `pessoais/LEIA.md`). O nome do arquivo vira o nome do branding.
2. Fonte: só Google Fonts (`@remotion/google-fonts/<Nome>`), carregada em `src/ds/fontes.ts`. Fonte de marca real é licenciada: nunca baixar da LP de referência, achar a equivalente livre.
3. Branding de cliente/marca: tirar cor e clima da referência, nunca a logo nem a fonte licenciada.
4. **Cor de destaque = a da marca do ASSUNTO** do vídeo (laranja Claude #D97757 em vídeo de Claude). Uma só por vídeo.
