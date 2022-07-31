import { css, Global } from '@emotion/react';

export default function Main() {
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
