import { ipcRenderer, contextBridge } from 'electron';
import { LyricDetailData } from './alsong';

ipcRenderer.on('app:setHistory', (_ev, songID: string, lyricID: number) => {
  window.localStorage.setItem(`lyric_${songID}`, lyricID.toString());
});

ipcRenderer.on('app:getHistory', (_ev, songID: string) => {
  const lyricID = window.localStorage.getItem(`lyric_${songID}`);
  ipcRenderer.send('app:getHistory', lyricID ? Number.parseInt(lyricID) : null);
});

const pandaLyricsAPI = {
  windowMoving: (x: number, y: number) => {
    ipcRenderer.send('app:windowMoving', x, y);
  },

  setWindowPos: (x?: number, y?: number) => {
    ipcRenderer.send('app:setWindowPos', x, y);
  },

  onSettingsOpen: (listener: () => void) => {
    ipcRenderer.on('dialog:openSettings', listener);
    return () => ipcRenderer.off('dialog:openSettings', listener);
  },

  addTickListener: (listener: (time: number) => void) => {
    ipcRenderer.on(
      'app:tick',
      (_event: Electron.IpcRendererEvent, value: number) => {
        listener(value);
      }
    );
    return () => ipcRenderer.off('app:tick', listener);
  },

  onSetMove: (listener: (value: boolean) => void) => {
    const handler = (_event: Electron.IpcRendererEvent, value: boolean) => {
      listener(value);
    };
    ipcRenderer.on('app:setMove', handler);
    return () => ipcRenderer.off('app:setMove', handler);
  },

  addLyricChangeListener: (listener: (value: LyricDetailData) => void) => {
    const handler = (
      _event: Electron.IpcRendererEvent,
      value: LyricDetailData
    ) => {
      listener(value);
    };
    ipcRenderer.on('app:setLyric', handler);
    return () => ipcRenderer.off('app:setLyric', handler);
  },

  onSetVisible: (listener: (value: boolean) => void) => {
    const handler = (_event: Electron.IpcRendererEvent, value: boolean) => {
      listener(value);
    };
    ipcRenderer.on('app:setVisible', handler);
    return () => ipcRenderer.off('app:setVisible', handler);
  },

  setMove: (value: boolean) => {
    ipcRenderer.send('app:setMove', value);
  },

  setVisible: (value: boolean) => {
    ipcRenderer.send('app:setVisible', value);
  },

  updateHeight: () => {
    ipcRenderer.send('app:updateHeight', document.body.clientHeight);
  },

  getAllSystemFonts(): string[] {
    return ipcRenderer.sendSync('app:getAllSystemFonts');
  },

  getAutoStart(): boolean {
    return ipcRenderer.sendSync('app:getAutoStart');
  },

  getWindowPos(): [number, number] {
    return ipcRenderer.sendSync('app:getWindowPos');
  },

  setAutoStart(value: boolean) {
    ipcRenderer.send('app:setAutoStart', value);
  },

  setWindowWidth(value: number) {
    ipcRenderer.send('app:setWindowWidth', value);
  },
};

contextBridge.exposeInMainWorld('pandaLyricsAPI', pandaLyricsAPI);

export type PandaLyricsAPI = typeof pandaLyricsAPI;
