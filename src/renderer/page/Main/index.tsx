import { css, Global } from '@emotion/react';
import { useLyric } from '../../store/lyric';
import useAppInitialEffect from '../../hooks/use-app-initial-effect';
import useOpenSettingsEffect from '../../hooks/use-open-settings-effect';
import Lyric from './Lyric';
import MovingBox from './MovingBox';

export default function Main() {
  const lyric = useLyric();
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
      <MovingBox>{lyric && <Lyric />}</MovingBox>
    </>
  );
}
