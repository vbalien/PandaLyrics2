import { ipcRenderer, contextBridge } from 'electron';

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

  onSetMove: (listener: (value: boolean) => void) => {
    const handler = (_event: Electron.IpcRendererEvent, value: boolean) => {
      listener(value);
    };
    ipcRenderer.on('app:setMove', handler);
    return () => ipcRenderer.off('app:setMove', handler);
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

  clearLyrics: () => {
    ipcRenderer.send('app:clearLyrics');
  },

  setLyrics: (lyrics: LyricInfo[]) => {
    ipcRenderer.send('app:setLyrics', lyrics);
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
};

contextBridge.exposeInMainWorld('pandaLyricsAPI', pandaLyricsAPI);

export type PandaLyricsAPI = typeof pandaLyricsAPI;
