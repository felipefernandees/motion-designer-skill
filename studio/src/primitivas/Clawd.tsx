import {useCurrentFrame, useVideoConfig} from 'remotion';
import {M, usaMola} from '../ds/movimento';

// Clawd: mascote pixel do Claude Code, fiel à grade original (12 x 8 blocos).
// REGRA (2026-09-28): aparece SÓ no gancho, fazendo algo junto da logo do Claude.
// No resto do vídeo, quando falar de Claude/Opus, usa a LOGO (<Logo nome="claude-color" />).
// Ações: tchau (braço direito), anda (pernas alternando), pisca, arma (blaster pixel na mão).
export const COR_CLAWD = '#C27E5E';
type Props = {
  tamanho: number; // largura do corpo em px (a arma, se houver, sai pra fora)
  arma?: boolean;
  andando?: boolean; // pernas alternando
  tchauEm?: number; // frame (local) em que acena
  piscaEm?: number[]; // frames (locais) em que pisca
  style?: React.CSSProperties;
};
export const Clawd: React.FC<Props> = ({tamanho, arma = false, andando = false, tchauEm, piscaEm = [], style}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const u = tamanho / 12;
  const passo = andando ? Math.round(Math.sin(f * 0.9)) : 0; // -1, 0, 1
  const tchau = tchauEm === undefined ? 0 : Math.sin(Math.max(0, f - tchauEm) * 0.55) * (f >= tchauEm && f < tchauEm + 20 ? 1 : 0);
  const pisca = piscaEm.some((p) => f >= p && f < p + 4);
  const arm = arma ? usaMola(f, fps, M.estalo) : 0;
  const r = (x: number, y: number, w: number, h: number, cor = COR_CLAWD, extra?: React.SVGProps<SVGRectElement>) => (
    <rect x={x * u} y={y * u} width={w * u} height={h * u} fill={cor} {...extra} />
  );
  const larg = arma ? 15 * u : 12 * u;
  return (
    <svg width={larg} height={8 * u} viewBox={`0 0 ${larg} ${8 * u}`} shapeRendering="crispEdges" style={{display: 'block', overflow: 'visible', ...style}}>
      {r(2, 0, 8, 6)}
      {r(0, 2, 2, 2)}
      <g transform={`translate(0 ${-tchau * 1.4 * u})`}>{r(10, 2, 2, 2)}</g>
      {r(3, pisca ? 1.4 : 1, 1, pisca ? 0.2 : 1, '#111')}
      {r(8, pisca ? 1.4 : 1, 1, pisca ? 0.2 : 1, '#111')}
      <g transform={`translate(0 ${passo > 0 ? -0.6 * u : 0})`}>{r(2, 6, 1, 2)}{r(7, 6, 1, 2)}</g>
      <g transform={`translate(0 ${passo < 0 ? -0.6 * u : 0})`}>{r(4, 6, 1, 2)}{r(9, 6, 1, 2)}</g>
      {arma && (
        <g transform={`translate(${11 * u} ${1.5 * u}) scale(${arm}) translate(${-11 * u} ${-1.5 * u})`}>
          {r(11, 1.5, 3, 1, '#3B2A2E')}
          {r(11.5, 2.5, 1, 1.2, '#3B2A2E')}
          {r(14, 1.7, 0.6, 0.6, '#F3D54A')}
        </g>
      )}
    </svg>
  );
};
