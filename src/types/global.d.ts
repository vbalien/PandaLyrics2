declare module '*.svg' {
  const value: string;
  export = value;
}

interface LyricInfo {
  title: string;
  album: string;
  artist: string;
}

interface SettingsType {
  fontFamily?: string;
  fontSize: number;
  windowLeft?: number;
  windowTop?: number;
  fontColor: string;
  shadowColor: string;
  bgVisible: boolean;
  appVisible: boolean;
  bgWidth: number;
  bgColor: string;
  bgAlpha: number;
  winAlpha: number;
}
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

type SettingsColorType = PostFixFilter<SettingsType, 'Color'>;
type SettingsNumberType = TypeFilter<SettingsType, number | undefined>;
type SettingsBoolType = TypeFilter<SettingsType, boolean>;

interface Window {
  pandaLyricsAPI: import('../main/preload').PandaLyricsAPI;
}
