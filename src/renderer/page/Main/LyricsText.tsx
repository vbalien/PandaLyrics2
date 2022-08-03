import { css } from '@emotion/react';

type LyricsTextProps = {
  textColor?: string;
  shadowColor?: string;
  text: string;
};
export default function LyricsText({
  textColor = '#fff',
  shadowColor = '#000',
  text,
}: LyricsTextProps) {
  return (
    <div
      css={css`
        word-wrap: break-word;
        color: ${textColor};
        font-size: 1em;
        text-shadow: 0 0 0.1875em ${shadowColor};
        width: 100%;
      `}
    >
      {text}
    </div>
  );
}
