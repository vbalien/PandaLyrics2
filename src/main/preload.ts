import { ipcRenderer, contextBridge } from 'electron';

contextBridge.exposeInMainWorld('pandaLyricsAPI', {
  onSettingsOpen: (listener: () => void) => {
    ipcRenderer.on('dialog:openSettings', listener);
    return () => ipcRenderer.off('dialog:openSettings', listener);
  },

  onSetMove: (listener: () => void) => {
    ipcRenderer.on('app:setMove', listener);
    return () => ipcRenderer.off('app:setMove', listener);
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
});
