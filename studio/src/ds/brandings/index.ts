import type {Branding} from '../tipos';
import {geral} from './geral';

// Registro de brandings.
// No repositório vai só o neutro no padrão Apple ("apple", arquivo geral.ts): funcionamento básico.
// Branding é PESSOAL de cada criador: cada um cria os seus em ./pessoais/<nome>.ts
// (exportando um Branding, modelo em pessoais/LEIA.md). Essa pasta fica fora do Git
// e é carregada sozinha aqui, sem precisar registrar.
// PADRAO é o que a skill usa quando o criador não disser qual (definido no perfil.md da skill).
const pessoais: Record<string, Branding> = {};
const ctx = (require as unknown as {context: (d: string, s: boolean, r: RegExp) => {keys: () => string[]; (k: string): Record<string, Branding>}}).context('./pessoais', false, /\.ts$/);
for (const k of ctx.keys()) {
  const nome = k.replace(/^\.\//, '').replace(/\.ts$/, '');
  const mod = ctx(k);
  pessoais[nome] = mod[nome] ?? Object.values(mod)[0];
}

export const BRANDINGS: Record<string, Branding> = {apple: geral, ...pessoais};
export type NomeBranding = string;
export const PADRAO: NomeBranding = 'apple';
