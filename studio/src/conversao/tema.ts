import {loadFont as loadDMSans} from '@remotion/google-fonts/DMSans';
import {loadFont as loadBricolage} from '@remotion/google-fonts/BricolageGrotesque';
import {Easing} from 'remotion';

export const ui = loadDMSans('normal', {weights: ['400', '500', '600', '700'], subsets: ['latin']}).fontFamily;
export const display = loadBricolage('normal', {weights: ['500', '600', '700'], subsets: ['latin']}).fontFamily;

// Design system inspirado na LP de referência, com vermelho no lugar do amarelo.
export const cor = {
  creme: '#F3F1EC',
  cremeCard: '#F5F3EF',
  tinta: '#2A140C',
  cinza: '#8A8680',
  linha: '#E7E3DC',
  vermelho: '#E4322B',
  vermelhoEscuro: '#B81F19',
  verde: '#1FAF5A',
  branco: '#FFFFFF',
};

export const suave = Easing.bezier(0.16, 1, 0.3, 1);
export const inOut = Easing.bezier(0.65, 0, 0.35, 1);
