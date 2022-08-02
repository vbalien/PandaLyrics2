import { css } from '@emotion/react';
import { ReactNode, useRef } from 'react';
import useMoveMode from '../../store/move-mode';

type MovingBoxProps = {
  children: ReactNode;
};
export default function MovingBox({ children }: MovingBoxProps) {
  const [moveMode, setMoveMode] = useMoveMode();
  const mouse = useRef({ x: 0, y: 0, isDown: false });
  const moveWindow = () => {
    window.pandaLyricsAPI.windowMoving(mouse.current.x, mouse.current.y);
    if (mouse.current.isDown) {
      requestAnimationFrame(moveWindow);
    }
  };

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
        user-select: none;
        cursor: move;
        background-color: ${moveMode ? '#000' : 'transparent'};
        width: 100vw;
        height: 100vh;
      `}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onDoubleClick={onDblClick}
    >
      {children}
    </div>
  );
}
