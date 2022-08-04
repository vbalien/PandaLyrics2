import { atom, useRecoilState } from 'recoil';

export type SettingsType = {
  fontFamily?: string;
  fontSize: number;
  windowLeft?: number;
  windowTop?: number;
  fontColor: string;
  shadowColor: string;
  bgVisible: boolean;
  appVisible: boolean;
  winWidth: number;
  bgColor: string;
  bgAlpha: number;
  winAlpha: number;
};
type PostFixFilter<T, F extends string> = keyof T extends infer K
  ? K extends `${string}${F}`
    ? K
    : never
  : never;
type TypeFilter<T, F> = {
  [K in keyof T]: T[K] extends F ? K : never;
}[keyof T] extends infer R
  ? R extends undefined
    ? never
    : R
  : never;

export type SettingsColorType = PostFixFilter<SettingsType, 'Color'>;
export type SettingsNumberType = TypeFilter<SettingsType, number | undefined>;
export type SettingsBoolType = TypeFilter<SettingsType, boolean>;

const initialState: SettingsType = {
  fontSize: 14,
  fontColor: '#fff',
  shadowColor: '#000',
  bgVisible: true,
  appVisible: true,
  winWidth: 600,
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
  const setter: SettingsSetter = (key, value) => {
    if (typeof key === 'string') {
      setState(currVal => {
        return { ...currVal, [key]: value };
      });
    } else {
      setState(currVal => {
        return { ...currVal, ...key };
      });
    }
  };
  return [state, setter];
}
