import {useBranding} from '../ds/contexto';

// iPhone genérico em coordenadas nativas: aparelho 390x844, tela 370x824 (offset 10).
// Tudo dentro (tela, cursor) usa essas coordenadas; quem posiciona e escala é o Palco.
export const LARGURA_TELA = 370;
export const ALTURA_TELA = 824;

export const Celular: React.FC<{
  children: React.ReactNode;
  escuro?: boolean;
  fundoTela?: string;
  ilha?: {abertura: number; conteudo?: React.ReactNode}; // abertura 0..1 (Dynamic Island)
  sobreposicao?: React.ReactNode; // cursor, ondas: fora do recorte da tela
}> = ({children, escuro, fundoTela, ilha, sobreposicao}) => {
  const b = useBranding();
  const a = ilha?.abertura ?? 0;
  const w = 122 + (340 - 122) * a;
  const h = 36 + (78 - 36) * a;
  const corStatus = escuro ? '#fff' : b.cor.tinta;
  return (
    <div
      style={{
        position: 'relative',
        width: 390,
        height: 844,
        borderRadius: 62,
        padding: 10,
        background: 'linear-gradient(145deg, #3a3a3c, #0c0c0d 40%, #1c1c1e)',
        boxShadow: `${b.sombra.aparelho}, inset 0 0 0 1.5px rgba(255,255,255,0.14)`,
      }}
    >
      <div
        style={{
          position: 'relative',
          width: 370,
          height: 824,
          borderRadius: b.raio.tela + 2,
          background: fundoTela ?? b.cor.superficie,
          overflow: 'hidden',
          fontFamily: b.fonte.texto,
          color: b.cor.tinta,
        }}
      >
        {children}
        <div style={{position: 'absolute', left: 34, top: 18, fontWeight: 600, fontSize: 16, color: corStatus, opacity: 1 - a}}>9:41</div>
        <div style={{position: 'absolute', right: 28, top: 21, display: 'flex', gap: 5, alignItems: 'flex-end', opacity: 1 - a}}>
          {[6, 8, 10, 12].map((hh, i) => (
            <div key={i} style={{width: 3.5, height: hh, borderRadius: 2, background: corStatus}} />
          ))}
          <div style={{width: 24, height: 12, borderRadius: 4, border: `1.5px solid ${corStatus}`, marginLeft: 5, padding: 1.5, opacity: 0.9}}>
            <div style={{width: '80%', height: '100%', borderRadius: 2, background: corStatus}} />
          </div>
        </div>
        <div
          style={{
            position: 'absolute',
            left: (370 - w) / 2,
            top: 11,
            width: w,
            height: h,
            borderRadius: h / 2,
            background: '#000',
            overflow: 'hidden',
            boxShadow: a > 0 ? '0 10px 30px rgba(0,0,0,0.25)' : 'none',
          }}
        >
          {a > 0.35 && ilha?.conteudo}
        </div>
      </div>
      {sobreposicao}
    </div>
  );
};
