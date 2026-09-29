import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {useBranding} from '../../../ds/contexto';
import {clamp, entre, inOut, M, tracking, usaMola} from '../../../ds/movimento';
import {Celular} from '../../../primitivas/Celular';
import {Cursor} from '../../../primitivas/Cursor';
import {Palco} from '../../../primitivas/Palco';
import {Som} from '../../../ds/som';

// 165 frames. Cria conta (digita nome e e-mail) → push pra tela do cartão →
// cartão gira e assenta → pede o cartão → Dynamic Island abre "Cartão a caminho".
const T = {nome: 26, email: 52, cliqueContinuar: 92, push: 96, cliquePedir: 134, ilha: 138};

const digita = (f: number, texto: string, inicio: number, velocidade = 1.1) =>
  texto.slice(0, Math.max(0, Math.floor((f - inicio) * velocidade)));

const Campo: React.FC<{rotulo: string; valor: string; ativo: boolean; primeiro?: boolean}> = ({rotulo, valor, ativo, primeiro}) => {
  const f = useCurrentFrame();
  const b = useBranding();
  const caret = ativo && Math.floor(f / 8) % 2 === 0;
  return (
    <div style={{position: 'relative', height: 66, padding: '0 18px', borderTop: primeiro ? 'none' : `1px solid ${b.cor.separador}`}}>
      <div style={{position: 'absolute', top: 12, fontSize: 13, color: b.cor.tintaSecundaria, fontWeight: 500}}>{rotulo}</div>
      <div style={{position: 'absolute', top: 32, fontSize: 18, fontWeight: 500, letterSpacing: tracking(18), display: 'flex', alignItems: 'center'}}>
        {valor || <span style={{color: 'rgba(60,60,67,0.3)'}}>{rotulo === 'Nome' ? 'Seu nome' : 'voce@email.com'}</span>}
        {caret && <span style={{width: 2, height: 22, background: b.cor.destaque, marginLeft: 1, borderRadius: 1}} />}
      </div>
    </div>
  );
};

const Botao: React.FC<{texto: string; top: number; clique: number}> = ({texto, top, clique}) => {
  const f = useCurrentFrame();
  const b = useBranding();
  const aperto = interpolate(f, [clique, clique + 3, clique + 10], [1, 0.95, 1], clamp);
  return (
    <div
      style={{
        position: 'absolute',
        left: 20,
        top,
        width: 330,
        height: 58,
        borderRadius: 58,
        background: b.cor.destaque,
        color: b.cor.sobreDestaque,
        fontSize: 18,
        fontWeight: 600,
        letterSpacing: tracking(18),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: `scale(${aperto})`,
        boxShadow: `0 12px 26px ${b.cor.destaque}55, inset 0 1px 0 rgba(255,255,255,0.35)`,
      }}
    >
      {texto}
    </div>
  );
};

export const Cartao: React.FC<{largura?: number}> = ({largura = 320}) => {
  const f = useCurrentFrame();
  const b = useBranding();
  const h = largura / 1.586;
  const brilho = interpolate(f % 120, [0, 120], [-60, 160]);
  const k = largura / 320;
  return (
    <div
      style={{
        position: 'relative',
        width: largura,
        height: h,
        borderRadius: 18 * k,
        background: `linear-gradient(135deg, ${b.cor.destaque} 0%, ${b.cor.destaqueEscuro} 100%)`,
        overflow: 'hidden',
        boxShadow: `0 24px 50px ${b.cor.destaqueEscuro}66, inset 0 1px 0 rgba(255,255,255,0.35)`,
        fontFamily: b.fonte.display,
        color: '#fff',
      }}
    >
      <div style={{position: 'absolute', inset: 0, background: `linear-gradient(115deg, transparent ${brilho - 20}%, rgba(255,255,255,0.28) ${brilho}%, transparent ${brilho + 20}%)`}} />
      <div style={{position: 'absolute', left: 22 * k, top: 18 * k, fontSize: 26 * k, fontWeight: 700, letterSpacing: tracking(26 * k)}}>
        {b.marca.palavra}
        <span style={{color: b.cor.tinta}}>.</span>
      </div>
      <div style={{position: 'absolute', left: 22 * k, top: 78 * k, width: 42 * k, height: 32 * k, borderRadius: 7 * k, background: 'linear-gradient(135deg, #f3e3b3, #c9a654)', boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.12)'}} />
      <svg style={{position: 'absolute', left: 76 * k, top: 82 * k}} width={22 * k} height={24 * k} viewBox="0 0 22 24">
        {[5, 10, 15].map((r) => (
          <path key={r} d={`M${2 + r * 0.25} ${12 - r * 0.6} Q ${2 + r * 0.55} 12 ${2 + r * 0.25} ${12 + r * 0.6}`} stroke="rgba(255,255,255,0.8)" strokeWidth="2" fill="none" strokeLinecap="round" />
        ))}
      </svg>
      <div style={{position: 'absolute', left: 22 * k, bottom: 18 * k, fontFamily: b.fonte.texto, fontSize: 15 * k, fontWeight: 500, letterSpacing: 2 * k, opacity: 0.9}}>•••• 4821</div>
      <div style={{position: 'absolute', right: 22 * k, bottom: 18 * k, fontFamily: b.fonte.texto, fontSize: 12 * k, fontWeight: 700, letterSpacing: 1.5 * k, opacity: 0.9}}>DÉBITO</div>
    </div>
  );
};

const TelaCadastro: React.FC = () => {
  const f = useCurrentFrame();
  const b = useBranding();
  return (
    <AbsoluteFill style={{background: b.cor.superficieAgrupada}}>
      <div style={{position: 'absolute', left: 24, top: 92, fontSize: 34, fontWeight: 700, letterSpacing: tracking(34)}}>Crie sua conta</div>
      <div style={{position: 'absolute', left: 24, top: 138, fontSize: 16, color: b.cor.tintaSecundaria}}>Leva menos de dois minutos.</div>
      <div style={{position: 'absolute', left: 16, top: 186, width: 338, borderRadius: b.raio.celula, background: b.cor.superficie, overflow: 'hidden', boxShadow: b.sombra.card}}>
        <Campo rotulo="Nome" valor={digita(f, 'Ana Lima', T.nome)} ativo={f >= T.nome - 6 && f < T.email} primeiro />
        <Campo rotulo="E-mail" valor={digita(f, 'ana@mundi.app', T.email)} ativo={f >= T.email && f < T.cliqueContinuar} />
      </div>
      <div style={{position: 'absolute', left: 16, top: 336, width: 338, height: 58, borderRadius: b.raio.celula, background: b.cor.superficie, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 18px', boxSizing: 'border-box', boxShadow: b.sombra.card}}>
        <span style={{fontSize: 17, fontWeight: 500}}>Conta em euro e dólar</span>
        <div style={{width: 52, height: 32, borderRadius: 32, background: b.cor.sucesso, position: 'relative'}}>
          <div style={{position: 'absolute', right: 2, top: 2, width: 28, height: 28, borderRadius: 28, background: '#fff', boxShadow: '0 2px 6px rgba(0,0,0,0.2)'}} />
        </div>
      </div>
      <Botao texto="Continuar" top={720} clique={T.cliqueContinuar} />
    </AbsoluteFill>
  );
};

const TelaCartao: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const b = useBranding();
  const gira = usaMola(f - T.push - 2, fps, M.chegada);
  const item = (i: number) => entre(f, T.push + 12 + i * 4, T.push + 28 + i * 4);
  const itens = ['Cartão virtual na hora', 'Cotação em tempo real', 'Entrega grátis em casa'];
  return (
    <AbsoluteFill style={{background: b.cor.superficie}}>
      <div style={{position: 'absolute', left: 25, top: 96, perspective: 900}}>
        <div style={{transform: `rotateY(${(1 - gira) * -38}deg) rotateX(${(1 - gira) * 12}deg) translateY(${(1 - gira) * 40}px)`, transformStyle: 'preserve-3d'}}>
          <Cartao />
        </div>
      </div>
      <div style={{position: 'absolute', left: 24, top: 340, fontSize: 30, fontWeight: 700, letterSpacing: tracking(30), opacity: item(0), transform: `translateY(${(1 - item(0)) * 16}px)`}}>
        Seu cartão global
      </div>
      <div style={{position: 'absolute', left: 24, top: 382, width: 320, fontSize: 16, lineHeight: 1.35, color: b.cor.tintaSecundaria, opacity: item(1)}}>
        Sem anuidade, aceito no mundo todo.
      </div>
      {itens.map((t, i) => (
        <div key={t} style={{position: 'absolute', left: 24, top: 438 + i * 48, display: 'flex', alignItems: 'center', gap: 12, fontSize: 17, fontWeight: 500, opacity: item(i + 2), transform: `translateX(${(1 - item(i + 2)) * 20}px)`}}>
          <div style={{width: 28, height: 28, borderRadius: 28, background: `${b.cor.destaque}1A`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <svg width="14" height="14" viewBox="0 0 14 14">
              <path d="M3 7.5 L6 10 L11 4" stroke={b.cor.destaque} strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          {t}
        </div>
      ))}
      <Botao texto="Pedir meu cartão" top={720} clique={T.cliquePedir} />
    </AbsoluteFill>
  );
};

export const CenaConta: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const b = useBranding();
  const push = entre(f, T.push, T.push + 16, inOut);
  const ilha = usaMola(f - T.ilha, fps, M.chegada);
  return (
    <Palco zoom={{frames: [20, 44, 84, 100], valores: [1, 1.14, 1.14, 1], origem: [960, 460]}}>
      {[...'Ana Lima'].map((_, i) => <Som key={`n${i}`} nome={(['tecla1', 'tecla2', 'tecla3'] as const)[i % 3]} em={T.nome + i / 1.1} volume={0.35} />)}
      {[...'ana@mundi.app'].map((_, i) => <Som key={`e${i}`} nome={(['tecla2', 'tecla3', 'tecla1'] as const)[i % 3]} em={T.email + i / 1.1} volume={0.35} />)}
      <Som nome="pop" em={T.cliqueContinuar + 1} volume={0.45} />
      <Som nome="swoosh" em={T.push} volume={0.4} />
      <Som nome="pop" em={T.cliquePedir + 1} volume={0.45} />
      <Som nome="ilha" em={T.ilha} volume={0.6} />
      <Celular
        ilha={{
          abertura: ilha,
          conteudo: (
            <div style={{display: 'flex', alignItems: 'center', height: '100%', padding: '0 18px', gap: 12, opacity: entre(f, T.ilha + 6, T.ilha + 14)}}>
              <div style={{width: 46, transform: 'scale(1)'}}>
                <Cartao largura={46} />
              </div>
              <div style={{flex: 1, fontFamily: b.fonte.texto}}>
                <div style={{color: '#fff', fontSize: 15, fontWeight: 600}}>Cartão a caminho</div>
                <div style={{color: 'rgba(255,255,255,0.6)', fontSize: 13}}>Chega em 5 dias úteis</div>
              </div>
              <svg width="30" height="30" viewBox="0 0 30 30">
                <circle cx="15" cy="15" r="12" stroke="rgba(255,255,255,0.18)" strokeWidth="3.5" fill="none" />
                <circle cx="15" cy="15" r="12" stroke={b.cor.sucesso} strokeWidth="3.5" fill="none" strokeLinecap="round" strokeDasharray={75.4} strokeDashoffset={75.4 * (1 - 0.25 * entre(f, T.ilha + 8, T.ilha + 24))} transform="rotate(-90 15 15)" />
              </svg>
            </div>
          ),
        }}
        sobreposicao={
          <Cursor
            pontos={[
              [66, 460, 900],
              [T.cliqueContinuar - 2, 190, 758],
              [T.push + 14, 190, 758],
              [T.cliquePedir - 2, 200, 760],
            ]}
            cliques={[T.cliqueContinuar, T.cliquePedir]}
            some={T.cliquePedir + 12}
          />
        }
      >
        <div style={{position: 'absolute', inset: 0, transform: `translateX(${-push * 110}px)`, filter: `brightness(${1 - push * 0.08})`}}>
          <TelaCadastro />
        </div>
        {f >= T.push && (
          <div style={{position: 'absolute', inset: 0, transform: `translateX(${(1 - push) * 370}px)`, boxShadow: '-12px 0 30px rgba(0,0,0,0.08)'}}>
            <TelaCartao />
          </div>
        )}
      </Celular>
    </Palco>
  );
};
