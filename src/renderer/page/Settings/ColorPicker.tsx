import { useState } from 'react';
import { ChromePicker, ColorChangeHandler } from 'react-color';
import { css } from '@emotion/react';

export type ColorPickerProps = {
  color: string;
  onChange?: ColorChangeHandler;
};
export default function ColorPicker(props: ColorPickerProps) {
  const [displayColorPicker, setDisplayColorPicker] = useState(false);
  const handleClose = () => {
    setDisplayColorPicker(false);
  };
  const handleOpen = () => {
    setDisplayColorPicker(true);
  };
  return (
    <>
      <div
        css={css`
          padding: 5px;
          background: #fff;
          border-radius: 1px;
          box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
          display: inline-block;
          cursor: pointer;
        `}
      >
        <div
          css={css`
            width: 36px;
            height: 14px;
            border-radius: 2px;
            background: ${props.color};
          `}
          onClick={handleOpen}
        />
        {displayColorPicker && (
          <div className="absolute">
            <div
              className="fixed left-0 top-0 right-0 bottom-0"
              onClick={handleClose}
            />
            <div
              className="absolute p-2"
              css={css`
                right: -50px;
                z-index: 9999;
              `}
            >
              <ChromePicker color={props.color} onChange={props.onChange} />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
