import type {Branding} from '../tipos';
import {inter, interTight} from '../fontes';

// Branding geral pra reels: neutro no padrão Apple, 1 cor de destaque.
export const geral: Branding = {
  nome: 'geral',
  cor: {
    fundo: '#F5F5F7',
    superficie: '#FFFFFF',
    superficieAgrupada: '#F2F2F7',
    tinta: '#1D1D1F',
    tintaSecundaria: '#6E6E73',
    separador: 'rgba(60,60,67,0.14)',
    destaque: '#0088FF',
    destaqueEscuro: '#0063D1',
    sucesso: '#34C759',
    sobreDestaque: '#FFFFFF',
  },
  fonte: {texto: inter, display: interTight},
  raio: {tela: 50, card: 26, controle: 999, celula: 18},
  sombra: {
    aparelho: '0 60px 120px rgba(0,0,0,0.22), 0 18px 40px rgba(0,0,0,0.12)',
    card: '0 1px 2px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.06)',
    flutuante: '0 24px 60px rgba(0,0,0,0.18), 0 6px 16px rgba(0,0,0,0.08)',
  },
  vidro: {
    claro: {
      background: 'linear-gradient(180deg, rgba(255,255,255,0.82), rgba(255,255,255,0.62))',
      backdropFilter: 'blur(24px) saturate(180%)',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.9), inset 0 0 0 1px rgba(255,255,255,0.45), 0 24px 60px rgba(0,0,0,0.16)',
    },
    escuro: {
      background: 'linear-gradient(180deg, rgba(255,255,255,0.20), rgba(255,255,255,0.10))',
      backdropFilter: 'blur(28px) saturate(160%)',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.28), inset 0 0 0 1px rgba(255,255,255,0.10), 0 18px 40px rgba(0,0,0,0.25)',
    },
  },
  marca: {palavra: 'studio', ponto: true, frase: ''},
};
