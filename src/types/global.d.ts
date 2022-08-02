declare module '*.svg' {
  const value: string;
  export = value;
}

interface LyricInfo {
  title: string;
  album: string;
  artist: string;
}

interface Window {
  pandaLyricsAPI: import('../main/preload').PandaLyricsAPI;
}
