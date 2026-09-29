import {Composition} from 'remotion';
import {Conversao} from './conversao/Conversao';
import {DURACAO_MODELO_EDITADO, ModeloEditado} from './acervo/_modelos/modelo-editado/ModeloEditado';
import {ModeloReels} from './acervo/_modelos/modelo-reels/ModeloReels';
import {DURACAO_MUNDI, MundiCompleto} from './acervo/demo-app/mundi-completo/MundiCompleto';

export const Root: React.FC = () => (
  <>
    <Composition id="ModeloReels" component={ModeloReels} defaultProps={{branding: 'apple' as const, som: false}} durationInFrames={240} fps={30} width={1080} height={1920} />
    <Composition id="MundiCompleto" component={MundiCompleto} defaultProps={{som: false}} durationInFrames={DURACAO_MUNDI} fps={30} width={1920} height={1080} />
    <Composition id="ModeloEditado" component={ModeloEditado} durationInFrames={DURACAO_MODELO_EDITADO} fps={30} width={1080} height={1920} />
    <Composition id="Conversao" component={Conversao} durationInFrames={300} fps={30} width={1920} height={1080} />
  </>
);
