import { css } from '@emotion/react';
import { useEffect, useMemo } from 'react';
import { useMoveMode } from '../../store/move-mode';
import tinycolor from 'tinycolor2';
import LyricText from './LyricText';
import { useSettings } from '../../store/settings';
import { useDisplayLyricEntities } from '../../store/lyric';

export default function Lyric() {
  const lyricEntities = useDisplayLyricEntities();
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
        min-height: 100px;
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
        <LyricText
          text="더블클릭시 위치이동을 완료합니다."
          textColor={settings.fontColor}
          shadowColor={settings.shadowColor}
        />
      ) : (
        lyricEntities.map(entity => (
          <LyricText
            key={entity.id}
            text={entity.content}
            textColor={settings.fontColor}
            shadowColor={settings.shadowColor}
          />
        ))
      )}
    </div>
  );
}
