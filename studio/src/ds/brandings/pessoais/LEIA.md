# Brandings pessoais (fora do Git)

Cada arquivo `<nome>.ts` desta pasta vira um branding com esse nome, carregado sozinho pelo `../index.ts`.
Exporte um `Branding` com o mesmo nome do arquivo. O jeito mais fácil é herdar o neutro e trocar só o que muda:

```ts
import type {Branding} from '../../tipos';
import {geral} from '../geral';

export const minhamarca: Branding = {
  ...geral,
  nome: 'minhamarca',
  cor: {...geral.cor, fundo: '#F3F1EC', destaque: '#E4322B', destaqueEscuro: '#B81F19'},
};
```

Uso: `<ReelsEditado branding="minhamarca" ...>`. O padrão de cada criador fica no `perfil.md` da skill.
