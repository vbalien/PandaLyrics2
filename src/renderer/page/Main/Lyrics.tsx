import { css } from '@emotion/react';
import { useEffect, useMemo } from 'react';
import useMoveMode from '../../store/move-mode';
import tinycolor from 'tinycolor2';
import LyricsText from './LyricsText';
import { useSettings } from '../../store/settings';

export default function Lyrics() {
  const [settings] = useSettings();
  const [moveMode] = useMoveMode();
  const bgColor = useMemo(
    () =>
      tinycolor(settings.bgColor)
        .setAlpha(settings.bgVisible ? settings.bgAlpha : 0)
        .toHex8String(),
    [settings]
  );
  useEffect(() => {
    window.pandaLyricsAPI.updateHeight();
  }, []);
  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        gap: 0.2em;
        justify-content: center;
        text-align: center;
        height: 100%;
        font-weight: bold;
        opacity: ${settings.winAlpha};
        background-color: ${bgColor};
        border-radius: 10px;
        padding: 0.5em 0;
        font-size: ${settings.fontSize}pt;
        font-family: ${settings.fontFamily};
      `}
    >
      {moveMode ? (
        <LyricsText
          text="더블클릭시 위치이동을 완료합니다."
          textColor={settings.fontColor}
          shadowColor={settings.shadowColor}
        />
      ) : (
        <LyricsText
          text="우리를 비추네"
          textColor={settings.fontColor}
          shadowColor={settings.shadowColor}
        />
      )}
    </div>
  );
}
