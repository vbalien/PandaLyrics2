declare module '*.svg' {
  const value: string;
  export = value;
}

interface Window {
  pandaLyricsAPI: import('../main/preload').PandaLyricsAPI;
}
