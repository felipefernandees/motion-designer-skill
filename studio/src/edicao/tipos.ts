// Edição de bruto (reels editado inteiro pela skill). Gerado por motor/preparar.py a partir de cortes.json.
// Tempos em SEGUNDOS no tempo da edição (já cortada). media_start = segundo do bruto onde o take começa.
export type Fala = {start: number; end: number; media_start: number; text: string};
export type Palavra = {w: string; t: number; seg: number};
export type Edicao = {segs: Fala[]; words: Palavra[]};
// Altura da legenda por fala: "div" = logo abaixo da divisa motion/câmera; "peito" = altura do corpo;
// "cheio" = embaixo, numa tela cheia de motion (vira escura se o fundo for claro).
export type ModoFala = 'div' | 'peito' | 'cheio';

export const duracaoEdicao = (ed: Edicao) => ed.segs[ed.segs.length - 1].end;

// Momento (s) da n-ésima ocorrência de uma palavra, opcionalmente dentro de uma fala.
// Sincronia da doutrina: a ação da tela acontece NA palavra que ela ilustra.
export const momento = (ed: Edicao, palavra: string, fala?: number, n = 1): number => {
  let k = 0;
  const alvo = palavra.toLowerCase();
  for (const w of ed.words) {
    if (w.w.replace(/[,.!?]$/, '').toLowerCase() === alvo && (fala === undefined || w.seg === fala)) {
      k++;
      if (k === n) return w.t;
    }
  }
  throw new Error(`palavra não encontrada: ${palavra}`);
};
