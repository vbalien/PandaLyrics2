declare module '*.svg' {
  const value: string;
  export = value;
}

interface LyricInfo {
  title: string;
  album: string;
  artist: string;
}

interface PandaLyricsAPI {
  onSettingsOpen(listener: () => void): () => void;
  setVisible(value: boolean): void;
  clearLyrics(value: boolean): void;
  setLyrics(lyrics: LyricInfo[]): void;
}

interface Window {
  pandaLyricsAPI: PandaLyricsAPI;
}
