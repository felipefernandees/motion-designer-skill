import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {useBranding} from '../../../ds/contexto';
import {brl, clamp, entre, M, suave, tracking, usaMola} from '../../../ds/movimento';
import {Bandeira, Moeda} from '../../../primitivas/Bandeira';
import {Celular} from '../../../primitivas/Celular';
import {Check} from '../../../primitivas/Check';
import {Cursor} from '../../../primitivas/Cursor';
import {Palco} from '../../../primitivas/Palco';
import {Som} from '../../../ds/som';

// 188 frames. Cursor abre o seletor (menu de vidro), escolhe EUR, valor rola,
// aperta Converter, carrega, tela de sucesso com check.
const T = {cursor: 26, clique1: 52, abre: 55, clique2: 88, fecha: 92, clique3: 132, sucesso: 150};

const Pilula: React.FC<{moeda: Moeda; seta?: boolean; ativo?: number}> = ({moeda, seta, ativo = 0}) => {
  const b = useBranding();
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        height: 40,
        padding: '0 12px 0 6px',
        borderRadius: 40,
        background: b.cor.superficie,
        boxShadow: `0 0 0 ${1 + ativo * 1.5}px ${ativo ? b.cor.destaque : b.cor.separador}, 0 1px 3px rgba(0,0,0,0.06)`,
        fontWeight: 600,
        fontSize: 15,
      }}
    >
      <Bandeira moeda={moeda} tamanho={28} />
      {moeda}
      {seta && (
        <svg width="12" height="8" viewBox="0 0 12 8">
          <path d="M1 1.5 L6 6.5 L11 1.5" stroke={b.cor.tinta} strokeWidth="2" fill="none" strokeLinecap="round" />
        </svg>
      )}
    </div>
  );
};

const TelaConverter: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const b = useBranding();
  const lista = usaMola(f - T.abre, fps, M.chegada) - usaMola(f - T.fecha, fps, M.padrao);
  const trocou = f >= T.fecha;
  const rolagem = entre(f, T.fecha, T.fecha + 24);
  const valor = trocou ? interpolate(rolagem, [0, 1], [917.43, 841.75]) : 917.43;
  const pisca = interpolate(f, [T.fecha, T.fecha + 6, T.fecha + 30], [0, 1, 0], clamp);
  const hover = entre(f, T.clique2 - 12, T.clique2 - 4);
  const aperto = interpolate(f, [T.clique3, T.clique3 + 4, T.clique3 + 10], [1, 0.95, 1], clamp);
  const carregando = f >= T.clique3 + 4;
  const ativa = interpolate(f, [T.clique1, T.clique1 + 4, T.fecha, T.fecha + 6], [0, 1, 1, 0], clamp);

  const card = (top: number, rotulo: string, conteudo: React.ReactNode, pilula: React.ReactNode) => (
    <div style={{position: 'absolute', left: 16, top, width: 338, height: 114, borderRadius: b.raio.card, background: b.cor.superficie, boxShadow: b.sombra.card}}>
      <div style={{position: 'absolute', left: 20, top: 18, fontSize: 14, color: b.cor.tintaSecundaria, fontWeight: 500}}>{rotulo}</div>
      <div style={{position: 'absolute', left: 20, top: 48}}>{conteudo}</div>
      <div style={{position: 'absolute', right: 16, top: 44}}>{pilula}</div>
    </div>
  );
  const linhas: {m: Moeda; nome: string}[] = [
    {m: 'USD', nome: 'Dólar americano'},
    {m: 'EUR', nome: 'Euro'},
    {m: 'GBP', nome: 'Libra esterlina'},
  ];

  return (
    <AbsoluteFill style={{background: b.cor.superficieAgrupada}}>
      <div style={{position: 'absolute', left: 24, top: 92, fontSize: 34, fontWeight: 700, letterSpacing: tracking(34)}}>Converter</div>
      <div style={{position: 'absolute', left: 24, top: 138, fontSize: 16, color: b.cor.tintaSecundaria}}>Do real para a moeda da viagem</div>
      {card(184, 'Você envia', <span style={{fontSize: 32, fontWeight: 700, letterSpacing: tracking(32)}}>R$ 5.000,00</span>, <Pilula moeda="BRL" />)}
      <div
        style={{
          position: 'absolute',
          left: 163,
          top: 280,
          width: 44,
          height: 44,
          borderRadius: 44,
          background: b.cor.tinta,
          border: `4px solid ${b.cor.superficieAgrupada}`,
          zIndex: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `rotate(${rolagem * 180}deg)`,
        }}
      >
        <svg width="14" height="16" viewBox="0 0 14 16">
          <path d="M7 1 L7 15 M2 10 L7 15 L12 10" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      {card(
        306,
        'Você recebe',
        <span style={{fontSize: 32, fontWeight: 700, letterSpacing: tracking(32), color: pisca > 0 ? b.cor.destaque : b.cor.tinta}}>
          {trocou ? '€ ' : 'US$ '}
          {brl(valor)}
        </span>,
        <Pilula moeda={trocou ? 'EUR' : 'USD'} seta ativo={ativa} />
      )}
      <div style={{position: 'absolute', left: 24, top: 440, fontSize: 14, color: b.cor.tintaSecundaria, display: 'flex', gap: 8, alignItems: 'center'}}>
        <span style={{width: 8, height: 8, borderRadius: 8, background: b.cor.sucesso, boxShadow: `0 0 0 ${3 + Math.sin(f / 6) * 2}px ${b.cor.sucesso}33`}} />
        {trocou ? '1 EUR = R$ 5,94' : '1 USD = R$ 5,45'} · cotação em tempo real
      </div>
      {/* menu de vidro, nasce do seletor */}
      <div
        style={{
          position: 'absolute',
          left: 122,
          top: 402,
          width: 232,
          borderRadius: 26,
          padding: 6,
          ...b.vidro.claro,
          opacity: Math.min(1, Math.max(0, lista) * 1.4),
          transform: `scale(${0.6 + Math.max(0, lista) * 0.4})`,
          filter: `blur(${(1 - Math.min(1, Math.max(0, lista))) * 8}px)`,
          transformOrigin: '85% 0%',
          zIndex: 5,
        }}
      >
        {linhas.map((l) => {
          const h = l.m === 'EUR' ? hover : 0;
          return (
            <div key={l.m} style={{display: 'flex', alignItems: 'center', gap: 12, height: 50, padding: '0 12px', borderRadius: 20, background: `rgba(0,0,0,${h * 0.06})`}}>
              <Bandeira moeda={l.m} tamanho={28} />
              <div style={{display: 'flex', flexDirection: 'column', flex: 1}}>
                <span style={{fontSize: 16, fontWeight: 600}}>{l.m}</span>
                <span style={{fontSize: 12, color: b.cor.tintaSecundaria}}>{l.nome}</span>
              </div>
              {l.m === 'USD' && !trocou && (
                <svg width="14" height="12" viewBox="0 0 14 12">
                  <path d="M1.5 6.5 L5 10 L12.5 2" stroke={b.cor.destaque} strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
          );
        })}
      </div>
      <div
        style={{
          position: 'absolute',
          left: 20,
          top: 720,
          width: 330,
          height: 58,
          borderRadius: 58,
          background: b.cor.destaque,
          color: '#fff',
          fontSize: 18,
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `scale(${aperto})`,
          boxShadow: `0 12px 26px ${b.cor.destaque}55, inset 0 1px 0 rgba(255,255,255,0.35)`,
        }}
      >
        {carregando ? (
          <div style={{width: 24, height: 24, borderRadius: 24, border: '3px solid rgba(255,255,255,0.35)', borderTopColor: '#fff', transform: `rotate(${(f - T.clique3) * 22}deg)`}} />
        ) : (
          'Converter agora'
        )}
      </div>
    </AbsoluteFill>
  );
};

const TelaSucesso: React.FC = () => {
  const f = useCurrentFrame();
  const b = useBranding();
  const conta = interpolate(f, [T.sucesso + 6, T.sucesso + 30], [0, 841.75], {...clamp, easing: suave});
  const sobe = (d: number) => entre(f, T.sucesso + d, T.sucesso + d + 16);
  return (
    <AbsoluteFill style={{background: b.cor.superficie, alignItems: 'center'}}>
      <div style={{position: 'absolute', top: 250}}>
        <Check inicio={T.sucesso + 2} />
      </div>
      <div style={{position: 'absolute', top: 384, fontSize: 16, color: b.cor.tintaSecundaria, opacity: sobe(6), transform: `translateY(${(1 - sobe(6)) * 16}px)`}}>Conversão concluída</div>
      <div style={{position: 'absolute', top: 410, fontSize: 54, fontWeight: 700, letterSpacing: tracking(54), fontVariantNumeric: 'tabular-nums', opacity: sobe(8), transform: `translateY(${(1 - sobe(8)) * 20}px)`}}>
        € {brl(conta)}
      </div>
      <div style={{position: 'absolute', top: 492, display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px 8px 8px', borderRadius: 40, background: b.cor.superficieAgrupada, fontSize: 14, fontWeight: 600, opacity: sobe(12), transform: `translateY(${(1 - sobe(12)) * 20}px)`}}>
        <Bandeira moeda="EUR" tamanho={22} />
        Já está na sua conta em euro
      </div>
    </AbsoluteFill>
  );
};

export const CenaConversao: React.FC = () => {
  const f = useCurrentFrame();
  const troca = entre(f, T.sucesso - 4, T.sucesso + 8);
  return (
    <Palco zoom={{frames: [24, 52, 100, 124], valores: [1, 1.2, 1.2, 1], origem: [960, 600]}}>
      <Som nome="swoosh" em={T.abre} volume={0.25} />
      {[0, 3, 6, 9, 12, 16, 21].map((d) => <Som key={d} nome="tique" em={T.fecha + d} volume={0.3} />)}
      <Som nome="pop" em={T.clique3 + 1} volume={0.45} />
      <Celular
        sobreposicao={
          <Cursor
            pontos={[
              [T.cursor, 470, 780],
              [T.clique1 - 2, 282, 376],
              [64, 282, 376],
              [T.clique2 - 2, 250, 486],
              [108, 250, 486],
              [T.clique3 - 2, 195, 760],
            ]}
            cliques={[T.clique1, T.clique2, T.clique3]}
            some={T.clique3 + 10}
          />
        }
      >
        <div style={{position: 'absolute', inset: 0, opacity: 1 - troca, transform: `scale(${1 - troca * 0.04})`}}>
          <TelaConverter />
        </div>
        {f >= T.sucesso - 4 && (
          <div style={{position: 'absolute', inset: 0, opacity: troca, transform: `scale(${1.04 - troca * 0.04})`}}>
            <TelaSucesso />
          </div>
        )}
      </Celular>
    </Palco>
  );
};
