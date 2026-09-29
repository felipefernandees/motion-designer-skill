import {AbsoluteFill, Sequence, useVideoConfig} from 'remotion';
import {useBranding} from '../ds/contexto';

// Trecho em tela cheia (motion cobre a câmera; a fala continua). de/ate em segundos da edição.
// Regra: até 2 por reels, nos momentos em que a animação precisa de espaço.
export const TelaCheia: React.FC<{de: number; ate: number; children: React.ReactNode}> = ({de, ate, children}) => {
  const {fps} = useVideoConfig();
  const b = useBranding();
  return (
    <Sequence from={Math.round(de * fps)} durationInFrames={Math.round((ate - de) * fps)} layout="none">
      <AbsoluteFill style={{background: b.cor.fundo}}>{children}</AbsoluteFill>
    </Sequence>
  );
};
