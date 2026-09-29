import {AbsoluteFill, interpolate, Sequence, useCurrentFrame, useVideoConfig} from 'remotion';
import {BrandingProvider, useBranding} from '../../../ds/contexto';
import {BRANDINGS, NomeBranding} from '../../../ds/brandings';
import {useArea} from '../../../ds/formatos';
import {clamp, entre, inOut, M, tracking, usaMola} from '../../../ds/movimento';
import {SomProvider} from '../../../ds/som';
import {CenaTexto} from '../../../primitivas/CenaTexto';
import {IconeApp} from '../../../primitivas/IconeApp';
import {Reels} from '../../../primitivas/Reels';

// MODELO de reels (copiar pra acervo/<topico>/<slug>/ ao criar um motion novo).
// Mostra: faixa de cima com carrossel de IAs trocando de seleção → expande pra tela cheia
// com frase → volta pra faixa de cima. Timing em frames; num motion real, vem da transcrição.
const MODELOS = [
  {logo: 'claudecode-color', nome: 'Claude Code'},
  {logo: 'gemini-color', nome: 'Gemini'},
  {logo: 'openai', nome: 'ChatGPT'},
];
const SELECAO = [{f: 0, i: 0}, {f: 54, i: 1}, {f: 96, i: 2}];

const Carrossel: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const b = useBranding();
  const {largura, altura} = useArea();
  const passo = 300;
  let pos = 0;
  for (let k = 1; k < SELECAO.length; k++) pos += usaMola(f - SELECAO[k].f, fps, M.chegada) * (SELECAO[k].i - SELECAO[k - 1].i);
  const cab = entre(f, 2, 18);
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', top: altura * 0.14, width: '100%', textAlign: 'center', opacity: cab, transform: `translateY(${(1 - cab) * 16}px)`}}>
        <div style={{fontFamily: b.fonte.texto, fontSize: 26, fontWeight: 600, letterSpacing: 4, color: b.cor.tintaSecundaria}}>CLAUDE CODE · TROCA DE MODELO</div>
        <div style={{fontFamily: b.fonte.display, fontSize: 76, fontWeight: 700, letterSpacing: tracking(76), color: b.cor.tinta, marginTop: 8}}>Trocando de modelo</div>
      </div>
      <div style={{position: 'absolute', top: altura * 0.46, left: largura / 2 - pos * passo, display: 'flex'}}>
        {MODELOS.map((m, i) => {
          const dist = Math.abs(i - pos);
          const sel = interpolate(dist, [0, 0.6], [1, 0], clamp);
          return (
            <div key={m.nome} style={{position: 'absolute', left: i * passo - 110, width: 220, display: 'flex', justifyContent: 'center', opacity: interpolate(dist, [0, 1, 2], [1, 0.55, 0.25], clamp), filter: `blur(${Math.max(0, dist - 0.4) * 3}px)`}}>
              <IconeApp logo={m.logo} tamanho={180} inicio={6 + i * 4} selecionado={sel} legenda={m.nome} />
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

export const ModeloReels: React.FC<{branding: NomeBranding; som: boolean}> = ({branding, som}) => {
  const f = useCurrentFrame();
  const volta = entre(f, 186, 196, inOut);
  return (
    <BrandingProvider branding={BRANDINGS[branding]}>
      <SomProvider ligado={som}>
        <Reels trocas={[{f: 0, modo: 'topo'}, {f: 138, modo: 'cheio'}, {f: 192, modo: 'topo'}]}>
          <Sequence durationInFrames={146}>
            <Carrossel />
          </Sequence>
          <Sequence from={140} durationInFrames={58}>
            <CenaTexto frase="Sem trocar de ferramenta." destaque={3} tamanho={110} />
          </Sequence>
          <Sequence from={190}>
            <div style={{opacity: volta}}>
              <Carrossel />
            </div>
          </Sequence>
        </Reels>
      </SomProvider>
    </BrandingProvider>
  );
};
