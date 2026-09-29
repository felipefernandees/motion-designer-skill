# Efeitos sonoros

- **Regra:** só som de INTERFACE (clique, pop, "colocar algo", digitação, notificação), baixinho (volume ≤ 0,3), colado no frame exato da ação. Laser, whoosh de arrasto, impacto, riser e brilho brigam com a trilha de fundo: não usar em reels.
- Banco aprovado `ui-*` em `studio/public/sfx/ui/` (sons gravados; baixados pelo `instalar.sh`): `ui-pop`, `ui-clique`, `ui-notificacao`, `ui-mensagem`, `ui-digitando`, `ui-clique-suave`, `ui-pop-grave`, `ui-tecla`.
- Uso: `<Som nome="ui-pop" em={frame} />` (`src/ds/som.tsx`), ligado por `<SomProvider ligado>`. No modo editado inteiro vem ligado; no overlay, desligado (o criador mixa no editor dele).
- Nomes antigos (banco sintetizado, reprovado por soar artificial) são redirecionados sozinhos: clique→ui-clique, tecla→ui-tecla, ding→ui-notificacao; whoosh/swoosh/impacto/riser ficam mudos.
- **Trilha sonora:** ainda não é da skill (próxima etapa: acervo de trilhas + mixagem com a voz). Quando entrar, a trilha fica por baixo e os SFX de interface por cima, baixos.
