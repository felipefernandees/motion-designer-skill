import {loadFont as loadInter} from '@remotion/google-fonts/Inter';
import {loadFont as loadInterTight} from '@remotion/google-fonts/InterTight';
import {loadFont as loadDMSans} from '@remotion/google-fonts/DMSans';
import {loadFont as loadBricolage} from '@remotion/google-fonts/BricolageGrotesque';
import {loadFont as loadGeist} from '@remotion/google-fonts/Geist';

// Inter é o equivalente livre mais próximo do SF Pro (texto); Inter Tight faz o papel do SF Display.
export const inter = loadInter('normal', {weights: ['400', '500', '600', '700'], subsets: ['latin']}).fontFamily;
export const interTight = loadInterTight('normal', {weights: ['500', '600', '700', '800'], subsets: ['latin']}).fontFamily;
export const dmSans = loadDMSans('normal', {weights: ['400', '500', '600', '700'], subsets: ['latin']}).fontFamily;
export const bricolage = loadBricolage('normal', {weights: ['500', '600', '700'], subsets: ['latin']}).fontFamily;
// Geist (Vercel, OFL): a mais próxima do SF Pro entre as livres. Padrão de TEXTO e LEGENDA desde 2026-09-28
// (Inter Tight ficou "genérica" em texto corrido; números seguem em Inter Tight, que ficam ótimos).
export const geist = loadGeist('normal', {weights: ['500', '600', '700'], subsets: ['latin']}).fontFamily;
