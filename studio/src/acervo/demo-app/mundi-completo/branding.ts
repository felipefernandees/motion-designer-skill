import type {Branding} from '../../../ds/tipos';
import {geral} from '../../../ds/brandings/geral';

// App fictício "mundi" (app de demonstração). Herda o geral e troca só a cor.
export const mundi: Branding = {
  ...geral,
  nome: 'mundi',
  cor: {...geral.cor, destaque: '#FF383C', destaqueEscuro: '#C8202A'},
  marca: {palavra: 'mundi', ponto: true, frase: 'Sua conta para o mundo.'},
};
