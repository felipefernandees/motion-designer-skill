import {creme} from './creme';
import {geral} from './geral';
import {mundi} from './mundi';

// Registro de brandings. "apple" é o neutro no padrão Apple (arquivo geral.ts).
// PADRAO é o que a skill usa quando o criador não disser qual (definido no perfil.md da skill).
export const BRANDINGS = {apple: geral, creme, mundi};
export type NomeBranding = keyof typeof BRANDINGS;
export const PADRAO: NomeBranding = 'apple';
