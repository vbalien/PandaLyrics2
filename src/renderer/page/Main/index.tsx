import { css, Global } from '@emotion/react';
import useOpenSettings from '../../hooks/use-open-settings';
import MovingBox from './MovingBox';

export default function Main() {
  useOpenSettings();

  return (
    <>
      <Global
        styles={css`
          html {
            background-color: transparent !important;
          }
        `}
      />
      <MovingBox>test</MovingBox>
    </>
  );
}
