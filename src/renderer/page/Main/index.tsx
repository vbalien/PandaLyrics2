import { css, Global } from '@emotion/react';
import { useEffect } from 'react';
import useDetectSettingsOpen from '../../hooks/use-open-settings';

export default function Main() {
  useDetectSettingsOpen();

  useEffect(() => {
    window.pandaLyricsAPI.setLyrics([
      {
        title: 'ilbe',
        artist: '',
        album: '',
      },
    ]);
  }, []);
  return (
    <>
      <Global
        styles={css`
          html {
            background-color: transparent !important;
          }
        `}
      />
      test
    </>
  );
}
