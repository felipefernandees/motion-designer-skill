import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {useBranding} from '../../../ds/contexto';
import {brl, clamp, entre, M, tracking, usaMola} from '../../../ds/movimento';
import {Celular} from '../../../primitivas/Celular';
import {Palco} from '../../../primitivas/Palco';
import {Som} from '../../../ds/som';

// 150 frames. Tela bloqueada escura; notificações de compra em euro chegam uma a uma
// (a nova entra no topo e empurra as outras); saldo gigante ao lado desce a cada compra.
const COMPRAS = [
  {f: 26, loja: 'Boulangerie', valor: 4.8},
  {f: 52, loja: 'Museu', valor: 14},
  {f: 78, loja: 'Metrô', valor: 2.15},
  {f: 104, loja: 'Bistrô', valor: 22.5},
];
const SALDO = 841.75;
const ALTURA = 82;

const Notificacao: React.FC<{loja: string; valor: number}> = ({loja, valor}) => {
  const b = useBranding();
  return (
    <div style={{width: 338, height: ALTURA - 8, borderRadius: 24, ...b.vidro.escuro, display: 'flex', alignItems: 'center', gap: 12, padding: '0 14px', boxSizing: 'border-box', color: '#fff'}}>
      <div style={{width: 40, height: 40, borderRadius: 10, background: b.cor.destaque, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: b.fonte.display, fontWeight: 800, fontSize: 22, letterSpacing: -1}}>m</div>
      <div style={{flex: 1}}>
        <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 15, fontWeight: 600}}>
          <span>{b.marca.palavra}</span>
          <span style={{fontSize: 13, fontWeight: 400, opacity: 0.6}}>agora</span>
        </div>
        <div style={{fontSize: 14, opacity: 0.9, marginTop: 2}}>
          Compra aprovada · € {brl(valor)} em {loja}
        </div>
      </div>
    </div>
  );
};

export const CenaPagamentos: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const b = useBranding();
  const chegadas = COMPRAS.map((c) => usaMola(f - c.f, fps, M.chegada));
  const empurra = (i: number) => chegadas.slice(i + 1).reduce((a, t) => a + t, 0);
  const gasto = COMPRAS.reduce((acc, c, i) => acc + c.valor * usaMola(f - c.f - 4, fps, M.padrao) * (i >= 0 ? 1 : 0), 0);
  const saldo = SALDO - gasto;
  const saldoIn = entre(f, 10, 28);
  const batida = COMPRAS.reduce((acc, c) => Math.max(acc, interpolate(f, [c.f + 2, c.f + 6, c.f + 18], [0, 1, 0], clamp)), 0);

  return (
    <Palco
      cx={600}
      diametro={780}
      extra={
        <div style={{position: 'absolute', left: 1080, top: 380, fontFamily: b.fonte.display, opacity: saldoIn, transform: `translateX(${(1 - saldoIn) * 40}px)`}}>
          <div style={{fontFamily: b.fonte.texto, fontSize: 30, fontWeight: 500, color: b.cor.tintaSecundaria, marginBottom: 6}}>Saldo em euro</div>
          <div style={{fontSize: 136, fontWeight: 700, letterSpacing: tracking(136), color: b.cor.tinta, fontVariantNumeric: 'tabular-nums', transform: `scale(${1 + batida * 0.025})`, transformOrigin: 'left center'}}>
            € {brl(saldo)}
          </div>
          <div style={{display: 'flex', gap: 10, marginTop: 14, fontFamily: b.fonte.texto, fontSize: 24, fontWeight: 600}}>
            {COMPRAS.map((c, i) => (
              <span key={i} style={{padding: '8px 16px', borderRadius: 40, background: b.cor.superficie, boxShadow: b.sombra.card, color: b.cor.destaque, opacity: chegadas[i] > 0.05 ? Math.min(1, chegadas[i]) : 0, transform: `translateY(${(1 - Math.min(1, chegadas[i])) * 16}px)`}}>
                − € {brl(c.valor)}
              </span>
            ))}
          </div>
        </div>
      }
    >
      {COMPRAS.map((c) => <Som key={c.f} nome="notificacao" em={c.f} volume={0.5} />)}
      <Celular escuro fundoTela={`radial-gradient(120% 80% at 30% 10%, ${b.cor.destaque} 0%, ${b.cor.destaqueEscuro} 35%, #140404 80%)`}>
        <AbsoluteFill style={{alignItems: 'center', color: '#fff'}}>
          <div style={{position: 'absolute', top: 76, fontSize: 19, fontWeight: 600, opacity: 0.85}}>sábado, 3 de outubro</div>
          <div style={{position: 'absolute', top: 98, fontFamily: b.fonte.display, fontSize: 104, fontWeight: 700, letterSpacing: tracking(104), lineHeight: 1}}>13:47</div>
          {COMPRAS.map((c, i) => {
            const t = chegadas[i];
            if (f < c.f) return null;
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: 16,
                  top: 250 + empurra(i) * ALTURA,
                  opacity: Math.min(1, t * 1.5),
                  transform: `translateY(${(1 - t) * -30}px) scale(${0.9 + Math.min(1, t) * 0.1})`,
                  filter: `blur(${(1 - Math.min(1, t)) * 8}px)`,
                }}
              >
                <Notificacao loja={c.loja} valor={c.valor} />
              </div>
            );
          })}
          <div style={{position: 'absolute', bottom: 12, width: 134, height: 5, borderRadius: 5, background: 'rgba(255,255,255,0.85)'}} />
        </AbsoluteFill>
      </Celular>
    </Palco>
  );
};
