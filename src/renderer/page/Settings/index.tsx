import { useState } from 'react';
import { ColorResult } from 'react-color';
import ColorPicker from './ColorPicker';

export default function Settings() {
  const [color, setColor] = useState<string>('#000');
  const handleChange = (color: ColorResult) => {
    setColor(color.hex);
  };
  return (
    <div className="m-3">
      <h1 className="text-base font-bold text-primary-content">글자 설정</h1>

      <div className="form-control">
        <label className="label cursor-pointer">
          <span className="label-text">글자색</span>
          <ColorPicker color={color} onChange={handleChange} />
        </label>
      </div>

      <div className="form-control">
        <label className="label cursor-pointer">
          <span className="label-text">그림자색</span>
          <ColorPicker color={color} onChange={handleChange} />
        </label>
      </div>

      <div className="form-control">
        <label className="label cursor-pointer">
          <span className="label-text">폰트</span>
          TODO
        </label>
      </div>

      <h1 className="text-base font-bold text-primary-content mt-5">창 설정</h1>

      <div className="form-control">
        <label className="label cursor-pointer">
          <span className="label-text">너비</span>
        </label>
        <input
          type="range"
          min="0"
          max="100"
          value="40"
          className="range range-xs"
        />
      </div>

      <div className="form-control">
        <label className="label cursor-pointer">
          <span className="label-text">투명도</span>
        </label>
        <input
          type="range"
          min="0"
          max="100"
          value="40"
          className="range range-xs"
        />
      </div>

      <h1 className="text-base font-bold text-primary-content mt-5">
        배경 설정
      </h1>

      <div className="form-control">
        <label className="label cursor-pointer">
          <span className="label-text">배경 표시</span>
          <input type="checkbox" className="toggle toggle-sm" checked />
        </label>
      </div>

      <div className="form-control">
        <label className="label cursor-pointer">
          <span className="label-text">배경색</span>
          <ColorPicker color={color} onChange={handleChange} />
        </label>
      </div>

      <div className="form-control">
        <label className="label cursor-pointer">
          <span className="label-text">투명도</span>
        </label>
        <input
          type="range"
          min="0"
          max="100"
          value="40"
          className="range range-xs"
        />
      </div>

      <h1 className="text-base font-bold text-primary-content mt-5">시스템</h1>
      <div className="form-control">
        <label className="label cursor-pointer">
          <span className="label-text">자동실행</span>
          <input type="checkbox" className="toggle toggle-sm" checked />
        </label>
      </div>
    </div>
  );
}
