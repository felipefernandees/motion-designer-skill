import type {Branding} from '../tipos';
import {bricolage, dmSans} from '../fontes';
import {geral} from './geral';

// Branding "creme": o da primeira versão do motion de conversão (inspirado na LP de um banco
// digital, 2026-09-28). DM Sans na interface, Bricolage Grotesque nos títulos, creme quente,
// marrom-café no texto, cantos generosos. Destaque trocável (padrão vermelho).
export const creme: Branding = {
  ...geral,
  nome: 'creme',
  cor: {
    fundo: '#F3F1EC',
    superficie: '#FFFFFF',
    superficieAgrupada: '#F5F3EF',
    tinta: '#2A140C',
    tintaSecundaria: '#8A8680',
    separador: '#E7E3DC',
    destaque: '#E4322B',
    destaqueEscuro: '#B81F19',
    sucesso: '#1FAF5A',
    sobreDestaque: '#FFFFFF',
  },
  fonte: {texto: dmSans, display: bricolage},
  raio: {tela: 50, card: 24, controle: 999, celula: 20},
  marca: {palavra: 'studio', ponto: true, frase: ''},
};
