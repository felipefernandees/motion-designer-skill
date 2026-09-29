import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {useBranding} from '../ds/contexto';
import {AreaProvider, FORMATOS} from '../ds/formatos';
import {M, usaMola} from '../ds/movimento';

// Layout de reels. O painel do motion ocupa a faixa de cima (modo "topo") ou a tela inteira
// (modo "cheio") e troca entre os dois com mola. Fora do painel fica TRANSPARENTE:
// o render em ProRes 4444 sai com alfa pra jogar por cima do vídeo do criador no editor (CapCut, Premiere...).
export type Troca = {f: number; modo: 'topo' | 'cheio'};

export const Reels: React.FC<{trocas: Troca[]; children: React.ReactNode; cantoInferior?: number}> = ({trocas, children, cantoInferior = 0}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const b = useBranding();
  const {largura, altura, topo} = FORMATOS.reels;
  const alvo = (modo: Troca['modo']) => (modo === 'topo' ? topo : altura);
  // soma das transições: cada troca empurra a altura do valor anterior pro novo
  let h = alvo(trocas[0]?.modo ?? 'topo');
  for (let i = 1; i < trocas.length; i++) {
    const t = usaMola(f - trocas[i].f, fps, M.padrao);
    h += (alvo(trocas[i].modo) - alvo(trocas[i - 1].modo)) * t;
  }
  const raio = h < altura - 1 ? cantoInferior : 0;
  return (
    <AbsoluteFill style={{background: 'transparent'}}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: largura,
          height: h,
          overflow: 'hidden',
          background: b.cor.fundo,
          borderBottomLeftRadius: raio,
          borderBottomRightRadius: raio,
        }}
      >
        <AreaProvider value={{largura, altura: h}}>{children}</AreaProvider>
      </div>
    </AbsoluteFill>
  );
};
