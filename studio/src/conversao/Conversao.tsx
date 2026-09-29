import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {cor, display, inOut, suave, ui} from './tema';
import {Bandeira, Moeda} from './Bandeira';

// Linha do tempo (30 fps, 300 frames = 10s)
const T = {
  textoSai: 40,
  palcoEntra: 38,
  cursorEntra: 66,
  clique1: 92,
  abreLista: 96,
  clique2: 128,
  fechaLista: 132,
  clique3: 174,
  sucesso: 192,
  saida: 234,
  logo: 252,
};

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const brl = (v: number) =>
  v.toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2});

// ---------- Texto palavra por palavra ----------
const Frase: React.FC<{palavras: string[]; destaque: number; inicio: number; cor?: string; corDestaque?: string}> = ({
  palavras,
  destaque,
  inicio,
  cor: corTexto = cor.tinta,
  corDestaque = cor.vermelho,
}) => {
  const f = useCurrentFrame();
  return (
    <div style={{display: 'flex', gap: 26, fontFamily: display, fontWeight: 600, fontSize: 118, letterSpacing: -4}}>
      {palavras.map((p, i) => {
        const t = interpolate(f, [inicio + i * 5, inicio + i * 5 + 16], [0, 1], {...clamp, easing: suave});
        return (
          <span
            key={p}
            style={{
              color: i === destaque ? corDestaque : corTexto,
              opacity: t,
              filter: `blur(${(1 - t) * 14}px)`,
              transform: `translateY(${(1 - t) * 28}px)`,
              display: 'inline-block',
            }}
          >
            {p}
          </span>
        );
      })}
    </div>
  );
};

// ---------- Cursor ----------
const pontos: [number, number, number][] = [
  // [frame, x, y] em coordenadas do aparelho
  [T.cursorEntra, 470, 780],
  [T.clique1 - 2, 282, 370],
  [106, 282, 370],
  [T.clique2 - 2, 250, 488],
  [150, 250, 488],
  [T.clique3 - 2, 195, 682],
];

const Cursor: React.FC = () => {
  const f = useCurrentFrame();
  const frames = pontos.map((p) => p[0]);
  const x = interpolate(f, frames, pontos.map((p) => p[1]), {...clamp, easing: inOut});
  const y = interpolate(f, frames, pontos.map((p) => p[2]), {...clamp, easing: inOut});
  const aperto = [T.clique1, T.clique2, T.clique3].reduce(
    (acc, c) => Math.min(acc, interpolate(f, [c, c + 3, c + 8], [1, 0.82, 1], clamp)),
    1
  );
  const opacidade =
    interpolate(f, [T.cursorEntra, T.cursorEntra + 6], [0, 1], clamp) *
    interpolate(f, [T.clique3 + 10, T.clique3 + 18], [1, 0], clamp);
  return (
    <div style={{position: 'absolute', left: x, top: y, opacity: opacidade, transform: `scale(${aperto})`, transformOrigin: '4px 4px', zIndex: 20}}>
      <svg width="34" height="40" viewBox="0 0 34 40" style={{filter: 'drop-shadow(0 6px 10px rgba(0,0,0,0.25))'}}>
        <path d="M3 2 L3 32 L11 25 L16.5 37 L22 34.5 L16.5 23 L27 23 Z" fill={cor.tinta} stroke="#fff" strokeWidth="2.4" strokeLinejoin="round" />
      </svg>
    </div>
  );
};

const Onda: React.FC<{frame: number; x: number; y: number}> = ({frame, x, y}) => {
  const f = useCurrentFrame();
  const t = interpolate(f, [frame, frame + 14], [0, 1], {...clamp, easing: suave});
  if (f < frame || f > frame + 14) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: x - 30,
        top: y - 30,
        width: 60,
        height: 60,
        borderRadius: 60,
        border: `3px solid ${cor.vermelho}`,
        opacity: 1 - t,
        transform: `scale(${0.3 + t})`,
        zIndex: 19,
      }}
    />
  );
};

// ---------- Tela do app ----------
const Pilula: React.FC<{moeda: Moeda; seta?: boolean; ativo?: number}> = ({moeda, seta, ativo = 0}) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      height: 40,
      padding: '0 12px 0 6px',
      borderRadius: 40,
      background: '#fff',
      boxShadow: `0 0 0 ${1 + ativo}px ${ativo ? cor.vermelho : cor.linha}`,
      fontFamily: ui,
      fontWeight: 600,
      fontSize: 15,
      color: cor.tinta,
    }}
  >
    <Bandeira moeda={moeda} tamanho={28} />
    {moeda}
    {seta && (
      <svg width="12" height="8" viewBox="0 0 12 8">
        <path d="M1 1.5 L6 6.5 L11 1.5" stroke={cor.tinta} strokeWidth="2" fill="none" strokeLinecap="round" />
      </svg>
    )}
  </div>
);

const TelaConverter: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const lista = spring({frame: f - T.abreLista, fps, config: {damping: 18, stiffness: 180}}) -
    spring({frame: f - T.fechaLista, fps, config: {damping: 20, stiffness: 200}});
  const trocou = f >= T.fechaLista;
  const rolagem = interpolate(f, [T.fechaLista, T.fechaLista + 24], [0, 1], {...clamp, easing: suave});
  const valor = trocou ? interpolate(rolagem, [0, 1], [917.43, 841.75]) : 917.43;
  const destaqueValor = interpolate(f, [T.fechaLista, T.fechaLista + 6, T.fechaLista + 30], [0, 1, 0], clamp);
  const hoverEur = interpolate(f, [T.clique2 - 12, T.clique2 - 4], [0, 1], clamp);
  const aperto = interpolate(f, [T.clique3, T.clique3 + 4, T.clique3 + 10], [1, 0.95, 1], clamp);
  const carregando = f >= T.clique3 + 4;
  const giro = (f - T.clique3) * 22;
  const pilulaAtiva = interpolate(f, [T.clique1, T.clique1 + 4, T.fechaLista, T.fechaLista + 6], [0, 1, 1, 0], clamp);

  const card = (top: number, rotulo: string, conteudo: React.ReactNode, pilula: React.ReactNode) => (
    <div style={{position: 'absolute', left: 18, top, width: 334, height: 112, borderRadius: 24, background: cor.cremeCard}}>
      <div style={{position: 'absolute', left: 20, top: 18, fontFamily: ui, fontSize: 14, color: cor.cinza, fontWeight: 500}}>{rotulo}</div>
      <div style={{position: 'absolute', left: 20, top: 46}}>{conteudo}</div>
      <div style={{position: 'absolute', right: 16, top: 42}}>{pilula}</div>
    </div>
  );

  const linhas: {m: Moeda; nome: string}[] = [
    {m: 'USD', nome: 'Dólar americano'},
    {m: 'EUR', nome: 'Euro'},
    {m: 'GBP', nome: 'Libra esterlina'},
  ];

  return (
    <AbsoluteFill style={{fontFamily: ui, color: cor.tinta}}>
      <div style={{position: 'absolute', left: 24, top: 92, fontSize: 32, fontWeight: 700, letterSpacing: -1}}>Converter</div>
      <div style={{position: 'absolute', left: 24, top: 136, fontSize: 15, color: cor.cinza}}>Do real para a moeda da sua viagem</div>

      {card(180, 'Você envia', <span style={{fontSize: 32, fontWeight: 700, letterSpacing: -1}}>R$ 5.000,00</span>, <Pilula moeda="BRL" />)}

      <div
        style={{
          position: 'absolute',
          left: 165,
          top: 276,
          width: 40,
          height: 40,
          borderRadius: 40,
          background: cor.tinta,
          border: '4px solid #fff',
          zIndex: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `rotate(${interpolate(rolagem, [0, 1], [0, 180])}deg)`,
        }}
      >
        <svg width="14" height="16" viewBox="0 0 14 16">
          <path d="M7 1 L7 15 M2 10 L7 15 L12 10" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {card(
        300,
        'Você recebe',
        <span style={{fontSize: 32, fontWeight: 700, letterSpacing: -1, color: destaqueValor > 0 ? cor.vermelho : cor.tinta, opacity: 1}}>
          {trocou ? '€ ' : 'US$ '}
          {brl(valor)}
        </span>,
        <Pilula moeda={trocou ? 'EUR' : 'USD'} seta ativo={pilulaAtiva} />
      )}

      <div style={{position: 'absolute', left: 24, top: 434, fontSize: 14, color: cor.cinza, display: 'flex', gap: 8, alignItems: 'center', opacity: 1 - Math.min(1, lista * 3)}}>
        <span style={{width: 8, height: 8, borderRadius: 8, background: cor.verde}} />
        {trocou ? '1 EUR = R$ 5,94' : '1 USD = R$ 5,45'} · cotação em tempo real
      </div>

      {/* Lista de moedas */}
      <div
        style={{
          position: 'absolute',
          left: 128,
          top: 396,
          width: 224,
          borderRadius: 20,
          background: '#fff',
          boxShadow: '0 18px 40px rgba(42,20,12,0.18), 0 0 0 1px rgba(42,20,12,0.06)',
          padding: 6,
          opacity: Math.min(1, lista * 1.4),
          transform: `translateY(${(1 - lista) * -14}px) scale(${0.94 + lista * 0.06})`,
          transformOrigin: 'top right',
          zIndex: 5,
        }}
      >
        {linhas.map((l) => {
          const ativo = l.m === 'EUR' ? hoverEur : 0;
          return (
            <div
              key={l.m}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                height: 48,
                padding: '0 12px',
                borderRadius: 14,
                background: `rgba(228,50,43,${ativo * 0.1})`,
              }}
            >
              <Bandeira moeda={l.m} tamanho={26} />
              <div style={{display: 'flex', flexDirection: 'column'}}>
                <span style={{fontSize: 15, fontWeight: 700}}>{l.m}</span>
                <span style={{fontSize: 12, color: cor.cinza}}>{l.nome}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Botão */}
      <div
        style={{
          position: 'absolute',
          left: 18,
          top: 642,
          width: 334,
          height: 62,
          borderRadius: 62,
          background: cor.vermelho,
          color: '#fff',
          fontSize: 18,
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `scale(${aperto})`,
          boxShadow: '0 12px 24px rgba(228,50,43,0.35)',
        }}
      >
        {carregando ? (
          <div style={{width: 24, height: 24, borderRadius: 24, border: '3px solid rgba(255,255,255,0.35)', borderTopColor: '#fff', transform: `rotate(${giro}deg)`}} />
        ) : (
          'Converter agora'
        )}
      </div>
    </AbsoluteFill>
  );
};

const TelaSucesso: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const bola = spring({frame: f - T.sucesso - 2, fps, config: {damping: 11, stiffness: 160}});
  const traco = interpolate(f, [T.sucesso + 8, T.sucesso + 22], [0, 1], {...clamp, easing: suave});
  const conta = interpolate(f, [T.sucesso + 6, T.sucesso + 30], [0, 841.75], {...clamp, easing: suave});
  const sobe = (d: number) => interpolate(f, [T.sucesso + d, T.sucesso + d + 16], [0, 1], {...clamp, easing: suave});
  return (
    <AbsoluteFill style={{fontFamily: ui, color: cor.tinta, alignItems: 'center'}}>
      <div
        style={{
          position: 'absolute',
          top: 250,
          width: 104,
          height: 104,
          borderRadius: 104,
          background: cor.verde,
          transform: `scale(${bola})`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 16px 36px rgba(31,175,90,0.35)',
        }}
      >
        <svg width="54" height="54" viewBox="0 0 54 54">
          <path d="M14 28 L23 37 L41 18" stroke="#fff" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="44" strokeDashoffset={44 * (1 - traco)} />
        </svg>
      </div>
      <div style={{position: 'absolute', top: 384, fontSize: 16, color: cor.cinza, opacity: sobe(6), transform: `translateY(${(1 - sobe(6)) * 16}px)`}}>
        Conversão concluída
      </div>
      <div style={{position: 'absolute', top: 412, fontSize: 52, fontWeight: 700, letterSpacing: -2, opacity: sobe(8), transform: `translateY(${(1 - sobe(8)) * 20}px)`}}>
        € {brl(conta)}
      </div>
      <div
        style={{
          position: 'absolute',
          top: 490,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '8px 14px 8px 8px',
          borderRadius: 40,
          background: cor.cremeCard,
          fontSize: 14,
          fontWeight: 600,
          opacity: sobe(12),
          transform: `translateY(${(1 - sobe(12)) * 20}px)`,
        }}
      >
        <Bandeira moeda="EUR" tamanho={22} />
        Já está na sua conta em euro
      </div>
    </AbsoluteFill>
  );
};

// ---------- Aparelho ----------
const Aparelho: React.FC = () => {
  const f = useCurrentFrame();
  const troca = interpolate(f, [T.sucesso - 4, T.sucesso + 6], [0, 1], {...clamp, easing: suave});
  return (
    <div style={{position: 'relative', width: 390, height: 844, borderRadius: 60, background: '#111', padding: 10, boxShadow: '0 50px 90px rgba(42,20,12,0.28)'}}>
      <div style={{position: 'relative', width: 370, height: 824, borderRadius: 50, background: '#fff', overflow: 'hidden'}}>
        {/* status bar */}
        <div style={{position: 'absolute', left: 36, top: 18, fontFamily: ui, fontWeight: 700, fontSize: 16, color: cor.tinta}}>9:41</div>
        <div style={{position: 'absolute', left: 124, top: 12, width: 122, height: 34, borderRadius: 34, background: '#111'}} />
        <div style={{position: 'absolute', right: 30, top: 22, display: 'flex', gap: 5}}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{width: 6, height: 6, borderRadius: 6, background: cor.tinta}} />
          ))}
        </div>
        <div style={{position: 'absolute', inset: 0, opacity: 1 - troca, transform: `translateX(${-troca * 40}px)`}}>
          <TelaConverter />
        </div>
        {f >= T.sucesso - 4 && (
          <div style={{position: 'absolute', inset: 0, opacity: troca, transform: `translateX(${(1 - troca) * 40}px)`}}>
            <TelaSucesso />
          </div>
        )}
      </div>
      <Onda frame={T.clique1} x={292} y={380} />
      <Onda frame={T.clique2} x={260} y={498} />
      <Onda frame={T.clique3} x={205} y={692} />
      <Cursor />
    </div>
  );
};

// ---------- Composição ----------
export const Conversao: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();

  // Cena 1: texto
  const saiTexto = interpolate(f, [T.textoSai, T.textoSai + 12], [0, 1], {...clamp, easing: inOut});

  // Cena 2: palco
  const circulo = spring({frame: f - T.palcoEntra, fps, config: {damping: 16, stiffness: 90}});
  const expande = interpolate(f, [T.saida + 4, T.saida + 24], [1, 2.8], {...clamp, easing: inOut});
  const aparelhoSobe = spring({frame: f - T.palcoEntra - 4, fps, config: {damping: 18, stiffness: 80}});
  const aparelhoDesce = interpolate(f, [T.saida, T.saida + 16], [0, 1], {...clamp, easing: Easing_in});
  const zoom = interpolate(f, [62, 92, 140, 164], [1, 1.2, 1.2, 1], {...clamp, easing: inOut});
  const flutua = Math.sin(f / 22) * 5;

  // Cena 3: marca
  const letras = 'mundi'.split('');

  return (
    <AbsoluteFill style={{background: cor.creme, overflow: 'hidden'}}>
      {f < T.textoSai + 14 && (
        <AbsoluteFill
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 1 - saiTexto,
            filter: `blur(${saiTexto * 16}px)`,
            transform: `scale(${1 + saiTexto * 0.08})`,
          }}
        >
          <Frase palavras={['Seu', 'real', 'vira', 'euro.']} destaque={3} inicio={4} />
        </AbsoluteFill>
      )}

      {f >= T.palcoEntra && (
        <AbsoluteFill style={{transform: `scale(${zoom})`, transformOrigin: '960px 600px'}}>
          <div
            style={{
              position: 'absolute',
              left: 960 - 450,
              top: 640 - 450,
              width: 900,
              height: 900,
              borderRadius: 900,
              background: cor.vermelho,
              transform: `scale(${circulo * expande})`,
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 960 - 195,
              top: 130,
              transform: `translateY(${(1 - aparelhoSobe) * 900 + aparelhoDesce * 1000 + flutua}px) scale(1.3)`,
              transformOrigin: 'top center',
            }}
          >
            <Aparelho />
          </div>
        </AbsoluteFill>
      )}

      {f >= T.logo - 2 && (
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 18}}>
          <div style={{display: 'flex', alignItems: 'flex-end', fontFamily: display, fontWeight: 700, fontSize: 200, letterSpacing: -8, color: '#fff', lineHeight: 1}}>
            {letras.map((l, i) => {
              const t = spring({frame: f - T.logo - i * 3, fps, config: {damping: 14, stiffness: 140}});
              return (
                <span key={i} style={{display: 'inline-block', transform: `translateY(${(1 - t) * 80}px)`, opacity: Math.min(1, t * 1.5)}}>
                  {l}
                </span>
              );
            })}
            <span
              style={{
                width: 36,
                height: 36,
                borderRadius: 36,
                background: cor.tinta,
                marginLeft: 8,
                marginBottom: 30,
                transform: `scale(${spring({frame: f - T.logo - 18, fps, config: {damping: 9, stiffness: 180}})})`,
              }}
            />
          </div>
          <div
            style={{
              fontFamily: ui,
              fontWeight: 500,
              fontSize: 34,
              color: 'rgba(255,255,255,0.85)',
              opacity: interpolate(f, [T.logo + 20, T.logo + 34], [0, 1], clamp),
              transform: `translateY(${interpolate(f, [T.logo + 20, T.logo + 34], [16, 0], {...clamp, easing: suave})}px)`,
            }}
          >
            Sua conta para o mundo.
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

function Easing_in(t: number) {
  return t * t * t;
}
