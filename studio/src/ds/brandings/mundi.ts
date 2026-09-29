import type {Branding} from '../tipos';
import {geral} from './geral';

// App fictício "mundi" (app de demonstração). Herda o geral e troca só a cor.
export const mundi: Branding = {
  ...geral,
  nome: 'mundi',
  cor: {...geral.cor, destaque: '#FF383C', destaqueEscuro: '#C8202A'},
  marca: {palavra: 'mundi', ponto: true, frase: 'Sua conta para o mundo.'},
};
