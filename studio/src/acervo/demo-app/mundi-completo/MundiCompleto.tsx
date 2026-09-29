import {Series} from 'remotion';
import {BrandingProvider} from '../../../ds/contexto';
import {mundi} from './branding';
import {SomProvider} from '../../../ds/som';
import {CenaTexto} from '../../../primitivas/CenaTexto';
import {Marca} from '../../../primitivas/Marca';
import {CenaConta} from './CenaConta';
import {CenaConversao} from './CenaConversao';
import {CenaPagamentos} from './CenaPagamentos';

// Roteiro de motion do comercial de referência (sem as cenas realistas):
// texto → app → texto → app → texto → app → texto → marca.
export const CENAS = [
  {d: 42, el: <CenaTexto frase="Abra sua conta global." destaque={3} />},
  {d: 165, el: <CenaConta />},
  {d: 42, el: <CenaTexto frase="Seu real vira euro." destaque={3} />},
  {d: 188, el: <CenaConversao />},
  {d: 42, el: <CenaTexto frase="Pague como um local." destaque={3} />},
  {d: 150, el: <CenaPagamentos />},
  {d: 70, el: <Marca />},
];
export const DURACAO_MUNDI = CENAS.reduce((a, c) => a + c.d, 0);

export const MundiCompleto: React.FC<{som: boolean}> = ({som}) => (
  <BrandingProvider branding={mundi}>
    <SomProvider ligado={som}>
    <Series>
      {CENAS.map((c, i) => (
        <Series.Sequence key={i} durationInFrames={c.d}>
          {c.el}
        </Series.Sequence>
      ))}
    </Series>
    </SomProvider>
  </BrandingProvider>
);
