import {Sequence, useCurrentFrame, useVideoConfig} from 'remotion';
import {useBranding} from '../ds/contexto';
import {geist} from '../ds/fontes';
import {M, usaMola} from '../ds/movimento';
import type {GrupoLegenda} from './agrupar';

// Legenda estilo "criador": minúscula, branca, sem caixa, sombra suave pra ler em cima da câmera.
// Em tela cheia de fundo claro vira escura (tinta do branding). Entra com mola + desfoque curto.
export const ALTURA_LEGENDA = {div: 948, peito: 1470, cheio: 1600};

const Grupo: React.FC<{g: GrupoLegenda; escura: boolean}> = ({g, escura}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const b = useBranding();
  const t = usaMola(f, fps, M.chegada);
  return (
    <div style={{position: 'absolute', left: 0, width: 1080, top: ALTURA_LEGENDA[g.modo], display: 'flex', justifyContent: 'center'}}>
      <span
        style={{
          fontFamily: geist, fontWeight: 600, fontSize: 78, letterSpacing: -2, lineHeight: 1.05, maxWidth: 960, textAlign: 'center',
          color: escura ? b.cor.tinta : '#FFFFFF',
          textShadow: escura ? 'none' : '0 2px 18px rgba(0,0,0,.55), 0 1px 3px rgba(0,0,0,.6)',
          opacity: t, transform: `translateY(${(1 - t) * 16}px)`, filter: `blur(${(1 - t) * 6}px)`,
        }}
      >
        {g.texto}
      </span>
    </div>
  );
};

export const Legendas: React.FC<{grupos: GrupoLegenda[]; fundoClaro: boolean}> = ({grupos, fundoClaro}) => {
  const {fps} = useVideoConfig();
  return (
    <>
      {grupos.map((g, i) => (
        <Sequence key={i} from={Math.round(g.de * fps)} durationInFrames={Math.max(1, Math.round((g.ate - g.de) * fps))} layout="none">
          <Grupo g={g} escura={fundoClaro && g.modo === 'cheio'} />
        </Sequence>
      ))}
    </>
  );
};
