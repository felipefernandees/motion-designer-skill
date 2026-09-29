import {AbsoluteFill} from 'remotion';
import {BrandingProvider, useBranding} from '../ds/contexto';
import {BRANDINGS, type NomeBranding} from '../ds/brandings';
import {AreaProvider} from '../ds/formatos';
import {SomProvider} from '../ds/som';
import {Trilha} from '../ds/trilha';
import {Camera} from './Camera';
import {agruparLegendas} from './agrupar';
import {Legendas} from './Legendas';
import type {Edicao, ModoFala} from './tipos';

// Reels EDITADO inteiro pela skill (não é overlay pro CapCut):
//   câmera cortada embaixo (deslocada pra baixo), painel de motion em cima (0..topo px),
//   telas cheias por cima de tudo quando a cena pede, legenda no topo das camadas.
// Tema padrão = branding "apple" (claro, #F5F5F7), o que ficou mais premium nos testes (2026-09-28).
export const TOPO_EDITADO = 900;
export const DESLOC_CAMERA = 300;

const Painel: React.FC<{topo: number; children: React.ReactNode}> = ({topo, children}) => {
  const b = useBranding();
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: topo, overflow: 'hidden', background: b.cor.fundo}}>
      <AreaProvider value={{largura: 1080, altura: topo}}>{children}</AreaProvider>
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 2, background: b.cor.separador}} />
    </div>
  );
};

export type PropsReelsEditado = {
  bruto: string; // caminho em public/, ex. "brutos/59.mp4" (proxy H.264 1080x1920)
  ed: Edicao;
  modos: ModoFala[]; // altura da legenda por fala
  branding?: NomeBranding;
  som?: boolean;
  trilha?: string; // slug em public/trilhas/ (CATALOGO.md). Todo reels editado leva uma, bem baixa.
  trilhaInicio?: number; // segundo da música onde começa
  manterMaiusculas?: string[];
  painel: React.ReactNode; // cenas do topo
  telaCheia?: React.ReactNode; // cenas de tela cheia (cada uma dentro de <Sequence>)
};

export const ReelsEditado: React.FC<PropsReelsEditado> = ({bruto, ed, modos, branding = 'apple', som = true, trilha, trilhaInicio, manterMaiusculas, painel, telaCheia}) => {
  const b = BRANDINGS[branding];
  const grupos = agruparLegendas(ed, modos, 3, manterMaiusculas);
  const claro = b.cor.fundo.toUpperCase() > '#888888';
  return (
    <BrandingProvider branding={b}>
      <SomProvider ligado={som}>
        <AbsoluteFill style={{background: '#0E0E0F'}}>
          {trilha ? <Trilha nome={trilha} inicio={trilhaInicio} /> : null}
          <Camera bruto={bruto} ed={ed} deslocY={DESLOC_CAMERA} />
          <Painel topo={TOPO_EDITADO}>{painel}</Painel>
          <AreaProvider value={{largura: 1080, altura: 1920}}>{telaCheia}</AreaProvider>
          <Legendas grupos={grupos} fundoClaro={claro} />
        </AbsoluteFill>
      </SomProvider>
    </BrandingProvider>
  );
};
