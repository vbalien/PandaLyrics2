import { css, Global } from '@emotion/react';
import useAppInitialEffect from '../../hooks/use-app-initial-effect';
import useOpenSettingsEffect from '../../hooks/use-open-settings-effect';
import Lyrics from './Lyrics';
import MovingBox from './MovingBox';

export default function Main() {
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
      <MovingBox>
        <Lyrics />
      </MovingBox>
    </>
  );
}
