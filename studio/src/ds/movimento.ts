import {Easing, interpolate, spring} from 'remotion';

// Linguagem de movimento do estúdio (base: Apple, Designing Fluid Interfaces).
// Mola descrita como a Apple descreve: resposta (s) + amortecimento (1 = sem quicar).
export const mola = (frame: number, fps: number, resposta = 0.4, amortecimento = 1) => {
  const massa = 1;
  const rigidez = Math.pow((2 * Math.PI) / resposta, 2) * massa;
  const atrito = (4 * Math.PI * amortecimento * massa) / resposta;
  return spring({frame, fps, config: {mass: massa, stiffness: rigidez, damping: atrito}});
};

// Presets. Padrão sem quique; quique só quando há "momento" (algo lançado, algo que chega).
export const M = {
  padrao: {resposta: 0.45, amortecimento: 1},
  entrada: {resposta: 0.6, amortecimento: 0.9},
  chegada: {resposta: 0.45, amortecimento: 0.78},
  estalo: {resposta: 0.3, amortecimento: 0.62},
  lento: {resposta: 0.9, amortecimento: 1},
};
export const usaMola = (frame: number, fps: number, p: {resposta: number; amortecimento: number}) =>
  mola(frame, fps, p.resposta, p.amortecimento);

export const suave = Easing.bezier(0.16, 1, 0.3, 1);
export const inOut = Easing.bezier(0.65, 0, 0.35, 1);
export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export const entre = (f: number, de: number, ate: number, easing = suave) =>
  interpolate(f, [de, ate], [0, 1], {...clamp, easing});

// Tracking por tamanho (tipografia Apple: texto grande aperta, pequeno abre).
export const tracking = (px: number) => {
  if (px >= 80) return `${-0.035 * px}px`;
  if (px >= 40) return `${-0.028 * px}px`;
  if (px >= 24) return `${-0.02 * px}px`;
  if (px >= 17) return `${-0.01 * px}px`;
  return '0px';
};

export const brl = (v: number) =>
  v.toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2});
