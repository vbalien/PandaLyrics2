import { css } from '@emotion/react';
import { ReactNode, useEffect, useRef } from 'react';
import { useSettings } from '../../store/settings';
import { useMoveMode } from '../../store/move-mode';

type MovingBoxProps = {
  children: ReactNode;
};
export default function MovingBox({ children }: MovingBoxProps) {
  const [moveMode, setMoveMode] = useMoveMode();
  const [, setSettings] = useSettings();
  const mouse = useRef({ x: 0, y: 0, isDown: false });
  const moveWindow = () => {
    window.pandaLyricsAPI.windowMoving(mouse.current.x, mouse.current.y);
    if (mouse.current.isDown) {
      requestAnimationFrame(moveWindow);
    }
  };

  useEffect(() => {
    if (moveMode) {
      return;
    }
    const [x, y] = window.pandaLyricsAPI.getWindowPos();
    setSettings({
      windowLeft: x,
      windowTop: y,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moveMode]);

  const onMouseDown: React.MouseEventHandler<HTMLElement> = e => {
    mouse.current.x = e.clientX;
    mouse.current.y = e.clientY;
    mouse.current.isDown = true;
    requestAnimationFrame(moveWindow);
  };

  const onMouseUp = () => {
    mouse.current.isDown = false;
  };

  const onDblClick = () => {
    mouse.current.isDown = false;
    setMoveMode(false);
  };

  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        justify-content: center;
        cursor: move;
        background-color: ${moveMode ? '#000' : 'transparent'};
        width: 100vw;
        min-height: 150px;
        padding: 0.5em;
      `}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onDoubleClick={onDblClick}
    >
      {children}
    </div>
  );
}
