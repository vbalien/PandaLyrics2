import { ipcRenderer, contextBridge } from 'electron';

const pandaLyricsAPI = {
  windowMoving: (x: number, y: number) => {
    ipcRenderer.send('windowMoving', x, y);
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

  setMove: (value: boolean) => {
    ipcRenderer.invoke('app:setMove', value);
  },

  setVisible: (value: boolean) => {
    ipcRenderer.invoke('app:setVisible', value);
  },

  clearLyrics: () => {
    ipcRenderer.invoke('app:clearLyrics');
  },

  setLyrics: (lyrics: LyricInfo[]) => {
    ipcRenderer.invoke('app:setLyrics', lyrics);
  },
};

contextBridge.exposeInMainWorld('pandaLyricsAPI', pandaLyricsAPI);

export type PandaLyricsAPI = typeof pandaLyricsAPI;
