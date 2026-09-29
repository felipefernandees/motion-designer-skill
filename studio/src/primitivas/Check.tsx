import {useCurrentFrame, useVideoConfig} from 'remotion';
import {useBranding} from '../ds/contexto';
import {entre, M, usaMola} from '../ds/movimento';
import {Som} from '../ds/som';

// Check de sucesso: bola chega com quique curto, traço se desenha.
export const Check: React.FC<{inicio: number; tamanho?: number}> = ({inicio, tamanho = 104}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const b = useBranding();
  const bola = usaMola(f - inicio, fps, M.estalo);
  const traco = entre(f, inicio + 6, inicio + 20);
  return (
    <div
      style={{
        width: tamanho,
        height: tamanho,
        borderRadius: tamanho,
        background: b.cor.sucesso,
        transform: `scale(${bola})`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 16px 36px rgba(52,199,89,0.35)',
      }}
    >
      <Som nome="ding" em={inicio} volume={0.55} />
      <svg width={tamanho * 0.52} height={tamanho * 0.52} viewBox="0 0 54 54">
        <path d="M14 28 L23 37 L41 18" stroke="#fff" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="44" strokeDashoffset={44 * (1 - traco)} />
      </svg>
    </div>
  );
};
