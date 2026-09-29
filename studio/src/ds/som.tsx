import {createContext, useContext} from 'react';
import {Audio, Sequence, staticFile} from 'remotion';

// Efeitos sonoros são OPCIONAIS. Reels normalmente vai sem (narração + música por cima);
// YouTube/comercial pode ir com. Cada primitiva declara o próprio som com <Som/>,
// e a chave <SomProvider ligado> decide se toca.
// Banco "ui" (gravado: Mixkit + HyperFrames, em public/sfx/ui/) é o APROVADO: só som de interface
// (clique, pop, colocar algo, digitar). Laser/whoosh/impacto/riser brigam com a trilha: não usar em reels.
// O banco sintetizado antigo (.wav) foi reprovado em 2026-09-28 (soava artificial); fica só por compatibilidade.
export type NomeSom =
  | 'ui-pop' | 'ui-clique' | 'ui-notificacao' | 'ui-mensagem' | 'ui-digitando' | 'ui-clique-suave' | 'ui-pop-grave' | 'ui-tecla'
  | 'clique' | 'pop' | 'tecla1' | 'tecla2' | 'tecla3' | 'whoosh' | 'swoosh'
  | 'ding' | 'notificacao' | 'ilha' | 'tique' | 'impacto' | 'riser';
const UI: Record<string, string> = {
  'ui-pop': 'ui/pop-leve.mp3', 'ui-clique': 'ui/click-select.mp3', 'ui-notificacao': 'ui/pop-notificacao.mp3',
  'ui-mensagem': 'ui/msg-pop.mp3', 'ui-digitando': 'ui/digitando-celular.mp3', 'ui-clique-suave': 'ui/hf-click-soft.mp3',
  'ui-pop-grave': 'ui/hf-pop.mp3', 'ui-tecla': 'ui/hf-key-press.mp3',
};

const Ctx = createContext(false);
export const SomProvider: React.FC<{ligado: boolean; children: React.ReactNode}> = ({ligado, children}) => (
  <Ctx.Provider value={ligado}>{children}</Ctx.Provider>
);

// Nomes antigos (banco sintetizado reprovado) são redirecionados pro banco "ui" gravado;
// whoosh/swoosh/impacto/riser ficam MUDOS (regra: só som de interface).
const REDIRECIONA: Record<string, string | null> = {
  clique: 'ui-clique', pop: 'ui-pop', tecla1: 'ui-tecla', tecla2: 'ui-tecla', tecla3: 'ui-tecla',
  ding: 'ui-notificacao', notificacao: 'ui-notificacao', ilha: 'ui-pop-grave', tique: 'ui-clique-suave',
  whoosh: null, swoosh: null, impacto: null, riser: null,
};

export const Som: React.FC<{nome: NomeSom; em: number; volume?: number}> = ({nome: pedido, em, volume = 0.6}) => {
  const ligado = useContext(Ctx);
  if (!ligado) return null;
  const nome = pedido in REDIRECIONA ? REDIRECIONA[pedido] : pedido;
  if (!nome) return null;
  return (
    <Sequence from={Math.round(em)} layout="none">
      <Audio src={staticFile(`sfx/${UI[nome]}`)} volume={Math.min(volume, 0.3)} />
    </Sequence>
  );
};
