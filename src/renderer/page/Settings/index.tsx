import { css } from '@emotion/react';
import { useEffect, useMemo, useState } from 'react';
import {
  SettingsBoolType,
  SettingsColorType,
  SettingsNumberType,
  useSettings,
} from '../../store/settings';

export default function Settings() {
  const [fonts, setFonts] = useState<string[]>([]);
  const [settings, setSettings] = useSettings();
  const { handleChangeColor, handleChangeNumber, handleChangeBool } = useMemo(
    () => ({
      handleChangeColor:
        (key: SettingsColorType) =>
        (ev: React.ChangeEvent<HTMLInputElement>) => {
          setSettings(key, ev.target.value);
        },
      handleChangeNumber:
        (key: SettingsNumberType) =>
        (ev: React.ChangeEvent<HTMLInputElement>) => {
          setSettings(key, Number.parseFloat(ev.target.value));
        },
      handleChangeBool:
        (key: SettingsBoolType) =>
        (ev: React.ChangeEvent<HTMLInputElement>) => {
          setSettings(key, ev.target.checked);
        },
    }),
    [setSettings]
  );
  useEffect(() => {
    setFonts(window.pandaLyricsAPI.getAllSystemFonts());
    document.title = 'Settings';
  }, []);

  return (
    <div className="m-3">
      <h1 className="text-base font-bold text-primary-content">가사</h1>
      <div className="form-control">
        <label className="label cursor-pointer">
          <span className="label-text">앞뒤 가사 보기</span>
          <input
            type="checkbox"
            className="toggle toggle-sm"
            checked={settings.threeView}
            onChange={handleChangeBool('threeView')}
          />
        </label>
      </div>

      <h1 className="text-base font-bold text-primary-content">글자 설정</h1>

      <div className="form-control">
        <label className="label cursor-pointer">
          <span className="label-text">글자색</span>
          <input
            type="color"
            value={settings.fontColor}
            onChange={handleChangeColor('fontColor')}
          />
        </label>
      </div>

      <div className="form-control">
        <label className="label cursor-pointer">
          <span className="label-text">그림자색</span>
          <input
            type="color"
            value={settings.shadowColor}
            onChange={handleChangeColor('shadowColor')}
          />
        </label>
      </div>

      <div className="form-control">
        <label className="label cursor-pointer">
          <span className="label-text">폰트</span>
          <select
            className="select select-bordered select-sm"
            onChange={ev => {
              setSettings('fontFamily', (ev.target as HTMLSelectElement).value);
            }}
            css={css`
              font-family: ${settings.fontFamily};
              font-size: 13pt;
            `}
          >
            {fonts.map(fontname => (
              <option
                key={fontname}
                css={css`
                  font-family: ${fontname};
                `}
                selected={fontname === settings.fontFamily}
              >
                {fontname.replaceAll('"', '')}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="form-control">
        <label className="label cursor-pointer">
          <span className="label-text">폰트 크기</span>
          <input
            type="number"
            className="input input-bordered input-sm"
            value={settings.fontSize}
            onChange={handleChangeNumber('fontSize')}
          />
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
          max="1000"
          value={settings.winWidth}
          className="range range-xs"
          onChange={handleChangeNumber('winWidth')}
        />
      </div>

      <div className="form-control">
        <label className="label cursor-pointer">
          <span className="label-text">투명도</span>
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={settings.winAlpha}
          className="range range-xs"
          onChange={handleChangeNumber('winAlpha')}
        />
      </div>

      <h1 className="text-base font-bold text-primary-content mt-5">
        배경 설정
      </h1>

      <div className="form-control">
        <label className="label cursor-pointer">
          <span className="label-text">배경 표시</span>
          <input
            type="checkbox"
            className="toggle toggle-sm"
            checked={settings.bgVisible}
            onChange={handleChangeBool('bgVisible')}
          />
        </label>
      </div>

      <div className="form-control">
        <label className="label cursor-pointer">
          <span className="label-text">배경색</span>
          <input
            type="color"
            value={settings.bgColor}
            onChange={handleChangeColor('bgColor')}
          />
        </label>
      </div>

      <div className="form-control">
        <label className="label cursor-pointer">
          <span className="label-text">투명도</span>
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={settings.bgAlpha}
          className="range range-xs"
          onChange={handleChangeNumber('bgAlpha')}
        />
      </div>

      <h1 className="text-base font-bold text-primary-content mt-5">시스템</h1>
      <div className="form-control">
        <label className="label cursor-pointer">
          <span className="label-text">자동실행</span>
          <input
            type="checkbox"
            className="toggle toggle-sm"
            defaultChecked={window.pandaLyricsAPI.getAutoStart()}
            onChange={ev => {
              window.pandaLyricsAPI.setAutoStart(ev.target.checked);
            }}
          />
        </label>
      </div>
    </div>
  );
}
