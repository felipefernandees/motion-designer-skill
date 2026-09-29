import {createContext, useContext} from 'react';
import type {Branding} from './tipos';
import {geral} from './brandings/geral';

const Ctx = createContext<Branding>(geral);
export const BrandingProvider: React.FC<{branding: Branding; children: React.ReactNode}> = ({branding, children}) => (
  <Ctx.Provider value={branding}>{children}</Ctx.Provider>
);
export const useBranding = () => useContext(Ctx);
