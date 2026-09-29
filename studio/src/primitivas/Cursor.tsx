import {interpolate, useCurrentFrame} from 'remotion';
import {useBranding} from '../ds/contexto';
import {clamp, entre, inOut} from '../ds/movimento';
import {Som} from '../ds/som';

// Cursor que percorre pontos [frame, x, y] (coordenadas do aparelho) e clica nos frames dados.
// Cada clique: cursor aperta e solta uma onda na cor da marca.
export const Cursor: React.FC<{pontos: [number, number, number][]; cliques: number[]; some?: number}> = ({pontos, cliques, some}) => {
  const f = useCurrentFrame();
  const b = useBranding();
  const fr = pontos.map((p) => p[0]);
  const x = interpolate(f, fr, pontos.map((p) => p[1]), {...clamp, easing: inOut});
  const y = interpolate(f, fr, pontos.map((p) => p[2]), {...clamp, easing: inOut});
  const aperto = cliques.reduce((acc, c) => Math.min(acc, interpolate(f, [c, c + 3, c + 9], [1, 0.8, 1], clamp)), 1);
  const alfa = entre(f, fr[0], fr[0] + 6) * (some ? 1 - entre(f, some, some + 8) : 1);
  const posEm = (c: number) => [
    interpolate(c, fr, pontos.map((p) => p[1]), {...clamp, easing: inOut}),
    interpolate(c, fr, pontos.map((p) => p[2]), {...clamp, easing: inOut}),
  ];
  return (
    <>
      {cliques.map((c) => (
        <Som key={`s${c}`} nome="clique" em={c} volume={0.7} />
      ))}
      {cliques.map((c) => {
        if (f < c || f > c + 16) return null;
        const t = entre(f, c, c + 16);
        const [cx, cy] = posEm(c);
        return (
          <div
            key={c}
            style={{
              position: 'absolute',
              left: cx - 32,
              top: cy - 32,
              width: 64,
              height: 64,
              borderRadius: 64,
              background: b.cor.destaque,
              opacity: (1 - t) * 0.28,
              transform: `scale(${0.25 + t})`,
              zIndex: 19,
            }}
          />
        );
      })}
      <div style={{position: 'absolute', left: x - 3, top: y - 3, opacity: alfa, transform: `scale(${aperto})`, transformOrigin: '3px 3px', zIndex: 20}}>
        <svg width="30" height="36" viewBox="0 0 34 40" style={{filter: 'drop-shadow(0 6px 10px rgba(0,0,0,0.28))'}}>
          <path d="M3 2 L3 32 L11 25 L16.5 37 L22 34.5 L16.5 23 L27 23 Z" fill="#111" stroke="#fff" strokeWidth="2.6" strokeLinejoin="round" />
        </svg>
      </div>
    </>
  );
};
