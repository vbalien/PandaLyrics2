import { css } from '@emotion/react';
import { useEffect, useMemo } from 'react';
import tinycolor from 'tinycolor2';
import LyricText from './LyricText';
import { useTransition, animated } from 'react-spring';
import { useMoveMode } from '../../store/move-mode';
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
  const transitions = useTransition(
    lyricEntities.map((e, idx) => {
      const prevTop = lyricEntities
        .slice(0, idx)
        .reduce(
          (prev, curr) => prev + (curr.content.match(/\n/g) || []).length + 1,
          0
        );
      return {
        ...e,
        top: prevTop + 1 + idx,
        height: (e.content.match(/\n/g) || []).length + 1,
      };
    }),
    {
      keys: item => item.id,
      config: { duration: 300 },
      from: { position: 'absolute', opacity: 0, transform: 'scale(0)' },
      leave: { opacity: 0, transform: 'scale(0)' },
      enter: e => ({
        opacity: e.current ? 1 : 0.6,
        transform: e.current ? 'scale(1)' : 'scale(0.8)',
      }),
      update: e => ({
        opacity: e.current ? 1 : 0.6,
        transform: e.current ? 'scale(1)' : 'scale(0.8)',
      }),
    }
  );
  const lyricHeight = useMemo(() => {
    return (
      lyricEntities.reduce(
        (prev, curr) => prev + (curr.content.match(/\n/g) || []).length + 1,
        0
      ) *
        settings.fontSize +
      settings.fontSize * (lyricEntities.length + 1)
    );
  }, [lyricEntities, settings.fontSize]);
  useEffect(() => {
    window.pandaLyricsAPI.updateHeight();
  }, [lyricEntities, settings.winWidth]);
  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        justify-content: center;
        position: relative;
        overflow: hidden;
        text-align: center;
        min-height: 50px;
        height: ${lyricHeight}px;
        font-weight: bold;
        opacity: ${settings.winAlpha};
        background-color: ${bgColor};
        border-radius: 10px;
        font-size: ${settings.fontSize}px;
        font-family: ${settings.fontFamily};
        line-height: 1em;
      `}
    >
      {moveMode ? (
        <LyricText
          text="더블클릭시 위치이동을 완료합니다."
          textColor={settings.fontColor}
          shadowColor={settings.shadowColor}
        />
      ) : (
        transitions(({ opacity, transform }, entity) => (
          <animated.div
            style={{
              position: 'absolute',
              transition: 'top 0.7s',
              top: entity.top * settings.fontSize,
              left: settings.fontSize / 2,
              right: settings.fontSize / 2,
              opacity,
              height: entity.height * settings.fontSize,
              overflow: 'hidden',
              transform: settings.threeView ? transform : undefined,
            }}
          >
            <LyricText
              text={entity.content}
              textColor={settings.fontColor}
              shadowColor={settings.shadowColor}
            />
          </animated.div>
        ))
      )}
    </div>
  );
}
