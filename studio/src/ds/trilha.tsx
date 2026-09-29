import {Audio, interpolate, staticFile, useVideoConfig} from 'remotion';

// Trilha sonora de fundo. Fica POR BAIXO da voz, bem baixa; os SFX de interface vão por cima.
// Arquivos em public/trilhas/<slug>.mp3, já normalizados em -20 LUFS pelo motor/trilha.sh
// (por isso um volume só serve pra todas). 0,14 ≈ 19 dB abaixo da voz: se ouve, não disputa.
// A pasta public/trilhas/ é PESSOAL (música com direito autoral) e fica fora do Git.
export const VOLUME_TRILHA = 0.14;

export const Trilha: React.FC<{nome: string; volume?: number; inicio?: number}> = ({nome, volume = VOLUME_TRILHA, inicio = 0}) => {
  const {fps, durationInFrames} = useVideoConfig();
  return (
    <Audio
      src={staticFile(`trilhas/${nome}.mp3`)}
      startFrom={Math.round(inicio * fps)}
      volume={(f) =>
        volume *
        interpolate(f, [0, 0.6 * fps, durationInFrames - 1.5 * fps, durationInFrames], [0, 1, 1, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })
      }
    />
  );
};
