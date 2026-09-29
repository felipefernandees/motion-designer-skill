export type Moeda = 'BRL' | 'USD' | 'EUR' | 'GBP';

// Bandeiras simplificadas em SVG, em círculo.
export const Bandeira: React.FC<{moeda: Moeda; tamanho: number}> = ({moeda, tamanho}) => (
  <svg width={tamanho} height={tamanho} viewBox="0 0 40 40" style={{borderRadius: 40, flexShrink: 0}}>
    <defs>
      <clipPath id={`c-${moeda}`}>
        <circle cx="20" cy="20" r="20" />
      </clipPath>
    </defs>
    <g clipPath={`url(#c-${moeda})`}>
      {moeda === 'BRL' && (
        <>
          <rect width="40" height="40" fill="#1F9D55" />
          <path d="M20 6 L36 20 L20 34 L4 20 Z" fill="#FFD43B" />
          <circle cx="20" cy="20" r="7.5" fill="#1D4DA8" />
        </>
      )}
      {moeda === 'USD' && (
        <>
          {Array.from({length: 7}).map((_, i) => (
            <rect key={i} y={i * 5.72} width="40" height="2.86" fill="#D22F27" />
          ))}
          <rect y="2.86" width="40" height="2.86" fill="#fff" />
          {Array.from({length: 7}).map((_, i) => (
            <rect key={`b${i}`} y={i * 5.72 + 2.86} width="40" height="2.86" fill="#fff" />
          ))}
          <rect width="20" height="20" fill="#1E3A8A" />
        </>
      )}
      {moeda === 'EUR' && (
        <>
          <rect width="40" height="40" fill="#1E40AF" />
          {Array.from({length: 12}).map((_, i) => {
            const a = (i / 12) * Math.PI * 2;
            return <circle key={i} cx={20 + Math.cos(a) * 10} cy={20 + Math.sin(a) * 10} r="1.6" fill="#FFD43B" />;
          })}
        </>
      )}
      {moeda === 'GBP' && (
        <>
          <rect width="40" height="40" fill="#1E3A8A" />
          <path d="M0 0 L40 40 M40 0 L0 40" stroke="#fff" strokeWidth="7" />
          <path d="M0 0 L40 40 M40 0 L0 40" stroke="#C8102E" strokeWidth="2.5" />
          <path d="M20 0 V40 M0 20 H40" stroke="#fff" strokeWidth="10" />
          <path d="M20 0 V40 M0 20 H40" stroke="#C8102E" strokeWidth="6" />
        </>
      )}
    </g>
  </svg>
);
