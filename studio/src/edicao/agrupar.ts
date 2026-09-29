import type {Edicao, ModoFala} from './tipos';

// Grupos de legenda no estilo criador: 2 a 3 palavras, quebra em pontuação e na troca de fala,
// tudo minúsculo (nomes em caixa alta ficam: CTA e siglas).
export type GrupoLegenda = {de: number; ate: number; texto: string; modo: ModoFala};
const MANTER = new Set(['EDITOR', 'DM', 'A', 'Z', 'IA']);

export const agruparLegendas = (ed: Edicao, modos: ModoFala[], maxPalavras = 3, manter: string[] = []): GrupoLegenda[] => {
  const fixo = new Set([...MANTER, ...manter]);
  const grupos: typeof ed.words[] = [];
  let atual: typeof ed.words = [];
  ed.words.forEach((w, i) => {
    atual.push(w);
    const prox = ed.words[i + 1];
    if (atual.length === maxPalavras || /[,.!?]$/.test(w.w) || !prox || prox.seg !== w.seg) {
      grupos.push(atual);
      atual = [];
    }
  });
  return grupos.map((g, gi) => {
    const fala = ed.segs[g[0].seg];
    const prox = grupos[gi + 1]?.[0].t ?? ed.segs[ed.segs.length - 1].end;
    const texto = g
      .map((x) => x.w.replace(/[,.]$/, ''))
      .map((x) => (fixo.has(x.replace(/[^A-Za-zÀ-ú]/g, '')) ? x : x.toLowerCase()))
      .join(' ');
    return {de: g[0].t, ate: Math.min(prox, fala.end + 0.25), texto, modo: modos[g[0].seg] ?? 'div'};
  });
};
