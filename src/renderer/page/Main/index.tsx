import { css, Global } from '@emotion/react';
import { useLyric } from '../../store/lyric';
import useAppInitialEffect from '../../hooks/use-app-initial-effect';
import useOpenSettingsEffect from '../../hooks/use-open-settings-effect';
import Lyric from './Lyric';
import MovingBox from './MovingBox';
import { useMoveMode } from '../../store/move-mode';

export default function Main() {
  const lyric = useLyric();
  const [moveMode] = useMoveMode();
  useOpenSettingsEffect();
  useAppInitialEffect();

  return (
    <>
      <Global
        styles={css`
          html {
            background-color: transparent !important;
            overflow: hidden;
          }
        `}
      />
      <MovingBox>{(lyric || moveMode) && <Lyric />}</MovingBox>
    </>
  );
}
