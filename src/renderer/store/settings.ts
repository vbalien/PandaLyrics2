import { useCallback } from 'react';
import { atom, useRecoilState } from 'recoil';

const initialState = {
  fontSize: 14,
  fontColor: '#fff',
  shadowColor: '#000',
  bgVisible: true,
  appVisible: true,
  bgWidth: 600,
  bgColor: '#000',
  bgAlpha: 0.4,
  winAlpha: 0.95,
};
const LOCAL_STORAGE_KEY = 'settings';
const SettingsState = atom<SettingsType>({
  key: 'Settings',
  default: initialState,
  effects: [
    ({ onSet, setSelf, trigger }) => {
      if (trigger === 'get') {
        const data = window.localStorage.getItem(LOCAL_STORAGE_KEY);
        const settings = data ? JSON.parse(data) : initialState;
        setSelf(settings);
      }

      const handler = (ev: StorageEvent) => {
        if (ev.key !== LOCAL_STORAGE_KEY) return;
        const data = ev.newValue;
        const settings = data ? JSON.parse(data) : initialState;
        setSelf(settings);
      };
      window.addEventListener('storage', handler);

      onSet(newValue => {
        window.localStorage.setItem(
          LOCAL_STORAGE_KEY,
          JSON.stringify(newValue)
        );
      });

      return () => {
        window.removeEventListener('storage', handler);
      };
    },
  ],
});

type SettingsSetter = <K extends keyof SettingsType, V extends SettingsType[K]>(
  key: K | Partial<SettingsType>,
  value?: V
) => void;
export function useSettings(): [SettingsType, SettingsSetter] {
  const [state, setState] = useRecoilState(SettingsState);
  const setter = useCallback<SettingsSetter>(
    (key, value) => {
      if (typeof key === 'string') {
        setState({ ...state, [key]: value });
      } else {
        setState({ ...state, ...key });
      }
    },
    [setState, state]
  );
  return [state, setter];
}
