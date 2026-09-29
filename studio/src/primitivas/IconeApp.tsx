import {useCurrentFrame, useVideoConfig} from 'remotion';
import {useBranding} from '../ds/contexto';
import {M, usaMola} from '../ds/movimento';
import {Logo} from './Logo';

// Ícone de app no estilo dos ícones novos da Apple (Icon Composer): quadrado de cantos contínuos
// (raio 22,4% do lado), camada de vidro com brilho especular no topo, luz vindo de cima,
// sombra de contato. Dentro, o logo do app. Entra com mola (chegada) a partir de `inicio`.
export const IconeApp: React.FC<{
  logo: string;
  tamanho?: number;
  inicio?: number;
  fundo?: string; // fundo do ícone (padrão: branco vidro)
  corLogo?: string;
  selecionado?: number; // 0..1: anel da cor de destaque + leve crescimento
  legenda?: string;
}> = ({logo, tamanho = 160, inicio = 0, fundo, corLogo, selecionado = 0, legenda}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const b = useBranding();
  const t = usaMola(f - inicio, fps, M.chegada);
  const r = tamanho * 0.224;
  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: tamanho * 0.12, opacity: Math.min(1, t * 1.4), transform: `translateY(${(1 - t) * 40}px) scale(${(0.7 + 0.3 * t) * (1 + selecionado * 0.08)})`}}>
      <div style={{position: 'relative', width: tamanho, height: tamanho}}>
        <div
          style={{
            position: 'absolute',
            inset: -tamanho * 0.07,
            borderRadius: r + tamanho * 0.07,
            boxShadow: `0 0 0 ${tamanho * 0.025}px ${b.cor.destaque}`,
            opacity: selecionado,
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: r,
            background: fundo ?? 'linear-gradient(180deg, #FFFFFF 0%, #F1F1F4 100%)',
            boxShadow: `0 ${tamanho * 0.08}px ${tamanho * 0.2}px rgba(0,0,0,0.14), 0 ${tamanho * 0.015}px ${tamanho * 0.04}px rgba(0,0,0,0.10), inset 0 0 0 1px rgba(0,0,0,0.05)`,
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Logo nome={logo} tamanho={tamanho * 0.56} cor={corLogo ?? b.cor.tinta} />
          {/* especular: luz de cima batendo na borda */}
          <div style={{position: 'absolute', inset: 0, borderRadius: r, background: 'linear-gradient(180deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 38%)', mixBlendMode: 'screen'}} />
          <div style={{position: 'absolute', inset: 0, borderRadius: r, boxShadow: `inset 0 ${tamanho * 0.012}px 0 rgba(255,255,255,0.9), inset 0 -${tamanho * 0.012}px 0 rgba(0,0,0,0.06)`}} />
        </div>
      </div>
      {legenda && (
        <div style={{fontFamily: b.fonte.texto, fontSize: tamanho * 0.16, fontWeight: 600, color: b.cor.tinta, opacity: 0.55 + selecionado * 0.45}}>{legenda}</div>
      )}
    </div>
  );
};
