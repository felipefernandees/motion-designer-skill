import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {useBranding} from '../ds/contexto';
import {entre, inOut, M, tracking, usaMola} from '../ds/movimento';
import {Som} from '../ds/som';
import {useArea} from '../ds/formatos';

// Encerramento: círculo da marca cresce do centro até cobrir a tela,
// palavra-marca sobe letra por letra, ponto estala, frase aparece.
export const Marca: React.FC<{tamanho?: number}> = ({tamanho = 210}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {largura: width, altura: height} = useArea();
  const b = useBranding();
  const cobre = Math.hypot(width, height);
  const wipe = entre(f, 0, 20, inOut);
  const letras = b.marca.palavra.split('');
  const frase = entre(f, 30, 46);
  return (
    <AbsoluteFill style={{background: b.cor.fundo, overflow: 'hidden'}}>
      <Som nome="whoosh" em={0} volume={0.45} />
      <Som nome="impacto" em={14} volume={0.8} />
      <div
        style={{
          position: 'absolute',
          left: width / 2 - cobre / 2,
          top: height / 2 - cobre / 2,
          width: cobre,
          height: cobre,
          borderRadius: cobre,
          background: b.cor.destaque,
          transform: `scale(${wipe})`,
        }}
      />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: tamanho * 0.1}}>
        <div style={{display: 'flex', alignItems: 'flex-end', fontFamily: b.fonte.display, fontWeight: 700, fontSize: tamanho, letterSpacing: tracking(tamanho), color: b.cor.sobreDestaque, lineHeight: 1}}>
          {letras.map((l, i) => {
            const t = usaMola(f - 12 - i * 2.5, fps, M.chegada);
            return (
              <span key={i} style={{display: 'inline-block', transform: `translateY(${(1 - t) * tamanho * 0.45}px)`, opacity: Math.min(1, t * 1.6), filter: `blur(${(1 - Math.min(1, t)) * 10}px)`}}>
                {l}
              </span>
            );
          })}
          {b.marca.ponto && (
            <span
              style={{
                width: tamanho * 0.17,
                height: tamanho * 0.17,
                borderRadius: tamanho,
                background: b.cor.tinta,
                marginLeft: tamanho * 0.04,
                marginBottom: tamanho * 0.14,
                transform: `scale(${usaMola(f - 12 - letras.length * 2.5 - 4, fps, M.estalo)})`,
              }}
            />
          )}
        </div>
        {b.marca.frase && (
          <div style={{fontFamily: b.fonte.texto, fontWeight: 500, fontSize: tamanho * 0.16, color: 'rgba(255,255,255,0.88)', opacity: frase, transform: `translateY(${(1 - frase) * 14}px)`}}>
            {b.marca.frase}
          </div>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
