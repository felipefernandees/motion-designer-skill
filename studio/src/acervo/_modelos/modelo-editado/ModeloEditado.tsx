import {AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig} from 'remotion';
import exemplo from '../../../../public/edicoes/exemplo.json';
import {M, usaMola} from '../../../ds/movimento';
import {Som} from '../../../ds/som';
import {CenaTexto} from '../../../primitivas/CenaTexto';
import {Clawd} from '../../../primitivas/Clawd';
import {Logo} from '../../../primitivas/Logo';
import {ReelsEditado} from '../../../edicao/ReelsEditado';
import {TelaCheia} from '../../../edicao/TelaCheia';
import type {Edicao, ModoFala} from '../../../edicao/tipos';
import {duracaoEdicao} from '../../../edicao/tipos';

// MODELO de reels EDITADO inteiro. Roda com a demo (skill/motion-designer/motor/demo.sh gera
// public/edicoes/exemplo.json + public/brutos/exemplo.mp4). Pra um vídeo seu: copie esta pasta pra
// src/acervo/<topico>/<slug>/, troque o import do JSON e o "bruto", e monte as cenas.
// Mostra o pipeline inteiro: cortes → câmera embaixo, legenda, 1 tela cheia,
// gancho com logo do Claude + Clawd (única aparição do mascote), frases palavra por palavra.
const ed = exemplo as Edicao;
const MODOS: ModoFala[] = ['div', 'peito', 'cheio', 'div'];
export const DURACAO_MODELO_EDITADO = Math.ceil(duracaoEdicao(ed) * 30) + 2;

const Gancho: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const logo = usaMola(f, fps, M.entrada);
  const cai = usaMola(f - 6, fps, M.chegada);
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', gap: 40, flexDirection: 'row'}}>
      <Som nome="ui-pop" em={8} />
      <div style={{transform: `scale(${logo}) rotate(${(1 - logo) * -120}deg)`}}>
        <Logo nome="claude-color" tamanho={230} />
      </div>
      <div style={{transform: `translateY(${(1 - cai) * -700}px)`}}>
        <Clawd tamanho={300} tchauEm={30} piscaEm={[26, 70]} />
      </div>
    </AbsoluteFill>
  );
};

export const ModeloEditado: React.FC = () => {
  const fps = 30;
  const s = (i: number) => ed.segs[i];
  const fr = (t: number) => Math.round(t * fps);
  const frase = (i: number, texto: string, destaque: number) => (
    <Sequence key={i} from={fr(s(i).start)} durationInFrames={fr(s(i).end) - fr(s(i).start)}>
      <CenaTexto frase={texto} destaque={destaque} tamanho={96} />
    </Sequence>
  );
  return (
    <ReelsEditado
      bruto="brutos/exemplo.mp4"
      ed={ed}
      modos={MODOS}
      manterMaiusculas={['MOTION', 'IA']}
      // trilha="<slug>"  // trilha de fundo do acervo (public/trilhas/CATALOGO.md); todo reels editado leva uma
      painel={
        <>
          <Sequence from={0} durationInFrames={fr(s(1).start)}><Gancho /></Sequence>
          {frase(1, 'Cortes, legendas e motion', 3)}
          {frase(3, 'Comenta MOTION', 1)}
        </>
      }
      telaCheia={<TelaCheia de={s(2).start} ate={s(2).end}><CenaTexto frase="Só duas coisas" destaque={1} tamanho={130} /></TelaCheia>}
    />
  );
};
