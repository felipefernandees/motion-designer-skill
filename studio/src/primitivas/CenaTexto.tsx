import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {useBranding} from '../ds/contexto';
import {entre, inOut, tracking} from '../ds/movimento';
import {Som} from '../ds/som';

// Frase curta (3 a 5 palavras) entrando palavra por palavra com desfoque.
// destaque = índice da palavra na cor da marca. Sai com desfoque nos últimos frames.
export const CenaTexto: React.FC<{
  frase: string;
  destaque?: number;
  tamanho?: number;
  atraso?: number;
  saida?: number; // frames de saída no fim da cena
  fundo?: string;
}> = ({frase, destaque = -1, tamanho = 120, atraso = 3, saida = 9, fundo}) => {
  const f = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const b = useBranding();
  const sai = entre(f, durationInFrames - saida, durationInFrames, inOut);
  const palavras = frase.split(' ');
  return (
    <AbsoluteFill style={{background: fundo ?? b.cor.fundo, alignItems: 'center', justifyContent: 'center'}}>
      <Som nome="whoosh" em={atraso} volume={0.35} />
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          columnGap: tamanho * 0.24,
          maxWidth: '86%',
          fontFamily: b.fonte.display,
          fontWeight: 600,
          fontSize: tamanho,
          letterSpacing: tracking(tamanho),
          lineHeight: 1.05,
          opacity: 1 - sai,
          filter: `blur(${sai * 18}px)`,
          transform: `scale(${1 + sai * 0.06})`,
        }}
      >
        {palavras.map((p, i) => {
          const t = entre(f, atraso + i * 4, atraso + i * 4 + 16);
          return (
            <span
              key={i}
              style={{
                display: 'inline-block',
                color: i === destaque ? b.cor.destaque : b.cor.tinta,
                opacity: t,
                filter: `blur(${(1 - t) * 16}px)`,
                transform: `translateY(${(1 - t) * 30}px)`,
              }}
            >
              {p}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
