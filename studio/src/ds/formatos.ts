import {createContext, useContext} from 'react';
import {useVideoConfig} from 'remotion';

// Formatos de saída.
// reels: 1080x1920. Modo "topo" = motion só na faixa de cima (42% da altura, como nos reels do
// criador: o rosto fica embaixo e a legenda cai na divisa). Modo "cheio" = tela inteira,
// só a narração por cima. horizontal: 16:9 pra YouTube/publi.
export const FORMATOS = {
  horizontal: {largura: 1920, altura: 1080},
  reels: {largura: 1080, altura: 1920, topo: 810},
} as const;

// Área de desenho atual. Primitivas (Palco, Marca, CenaTexto) medem por ela,
// então a mesma cena funciona na faixa de cima, na tela cheia ou no 16:9.
type Area = {largura: number; altura: number};
const Ctx = createContext<Area | null>(null);
export const AreaProvider = Ctx.Provider;
export const useArea = (): Area => {
  const a = useContext(Ctx);
  const {width, height} = useVideoConfig();
  return a ?? {largura: width, altura: height};
};
