import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {useBranding} from '../ds/contexto';
import {clamp, entre, inOut, M, usaMola} from '../ds/movimento';
import {Som} from '../ds/som';
import {useArea} from '../ds/formatos';

// Palco padrão: círculo da marca atrás + aparelho subindo com mola, flutuando leve,
// com zoom de câmera opcional num ponto e saída com desfoque.
export const Palco: React.FC<{
  children: React.ReactNode; // o <Celular/>
  cx?: number; // centro horizontal do aparelho na composição
  topo?: number;
  escala?: number;
  diametro?: number;
  zoom?: {frames: number[]; valores: number[]; origem: [number, number]};
  extra?: React.ReactNode; // elementos fora do aparelho (ex.: saldo gigante)
  semSaida?: boolean;
}> = ({children, cx: cxProp, topo = 120, escala = 1.3, diametro = 900, zoom, extra, semSaida}) => {
  const f = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const {largura, altura: height} = useArea();
  const cx = cxProp ?? largura / 2;
  const b = useBranding();
  const circulo = usaMola(f, fps, M.entrada);
  const sobe = usaMola(f - 4, fps, M.entrada);
  const sai = semSaida ? 0 : entre(f, durationInFrames - 9, durationInFrames, inOut);
  const z = zoom ? interpolate(f, zoom.frames, zoom.valores, {...clamp, easing: inOut}) : 1;
  const flutua = Math.sin(f / 24) * 5;
  return (
    <AbsoluteFill
      style={{
        background: b.cor.fundo,
        overflow: 'hidden',
      }}
    >
      <Som nome="swoosh" em={2} volume={0.35} />
      <AbsoluteFill
        style={{
          transform: `scale(${z * (1 + sai * 0.05)})`,
          transformOrigin: zoom ? `${zoom.origem[0]}px ${zoom.origem[1]}px` : '50% 50%',
          opacity: 1 - sai,
          filter: `blur(${sai * 16}px)`,
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: cx - diametro / 2,
            top: height * 0.56 - diametro / 2,
            width: diametro,
            height: diametro,
            borderRadius: diametro,
            background: `radial-gradient(circle at 35% 30%, ${b.cor.destaque}, ${b.cor.destaqueEscuro})`,
            transform: `scale(${circulo})`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: cx - 195,
            top: topo,
            transform: `translateY(${(1 - sobe) * 1000 + flutua}px) scale(${escala})`,
            transformOrigin: 'top center',
          }}
        >
          {children}
        </div>
        {extra}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
