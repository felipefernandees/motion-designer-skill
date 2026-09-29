import {Img, staticFile} from 'remotion';

// Logos de apps e IAs (pacote aberto @lobehub/icons, 950 logos em public/logos/).
// Nome = arquivo sem .svg. Variantes: "claude-color" (cores originais), "claude" (monocromático,
// pinta com `cor`), "claude-text" (palavra). Lista: ls public/logos.
// Regra: logo de terceiro aparece na cor original sempre que existir a variante -color;
// nunca redesenhar nem passar por gerador de imagem.
export const Logo: React.FC<{nome: string; tamanho: number; cor?: string; style?: React.CSSProperties}> = ({nome, tamanho, cor = '#1D1D1F', style}) => {
  const src = staticFile(`logos/${nome}.svg`);
  const colorido = nome.endsWith('-color') || nome.includes('-brand-color');
  if (colorido) return <Img src={src} style={{width: tamanho, height: tamanho, display: 'block', ...style}} />;
  return (
    <div
      style={{
        width: tamanho,
        height: tamanho,
        background: cor,
        WebkitMaskImage: `url(${src})`,
        WebkitMaskSize: 'contain',
        WebkitMaskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center',
        maskImage: `url(${src})`,
        maskSize: 'contain',
        maskRepeat: 'no-repeat',
        maskPosition: 'center',
        ...style,
      }}
    />
  );
};
