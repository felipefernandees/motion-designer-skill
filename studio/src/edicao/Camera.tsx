import {Audio, OffthreadVideo, Sequence, staticFile, useVideoConfig} from 'remotion';
import type {Edicao} from './tipos';

// A câmera do criador, cortada pelos takes escolhidos (regra: o ÚLTIMO take de cada fala).
// Imagem e som separados: a imagem do último corte vai até o fim da composição
// (senão a câmera some no fim), o som para exatamente no fim da fala.
export const Camera: React.FC<{bruto: string; ed: Edicao; deslocY: number; volume?: number}> = ({bruto, ed, deslocY, volume = 1}) => {
  const {fps, durationInFrames, width, height} = useVideoConfig();
  const src = staticFile(bruto);
  return (
    <>
      {ed.segs.map((s, i) => {
        const de = Math.round(s.start * fps);
        const ultimo = i === ed.segs.length - 1;
        const ateImg = ultimo ? durationInFrames : Math.round(s.end * fps);
        const ateSom = Math.round(s.end * fps);
        const ini = Math.round(s.media_start * fps);
        return (
          <Sequence key={i} from={de} durationInFrames={ateImg - de} layout="none">
            <OffthreadVideo src={src} startFrom={ini} muted style={{position: 'absolute', left: 0, top: deslocY, width, height, objectFit: 'cover'}} />
            <Sequence durationInFrames={ateSom - de} layout="none">
              <Audio src={src} startFrom={ini} volume={volume} />
            </Sequence>
          </Sequence>
        );
      })}
    </>
  );
};
