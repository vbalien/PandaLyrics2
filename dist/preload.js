"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
electron_1.ipcRenderer.on('app:setHistory', (_ev, songID, lyricID) => {
    window.localStorage.setItem(`lyric_${songID}`, lyricID.toString());
});
electron_1.ipcRenderer.on('app:getHistory', (_ev, songID) => {
    const lyricID = window.localStorage.getItem(`lyric_${songID}`);
    electron_1.ipcRenderer.send('app:getHistory', lyricID ? Number.parseInt(lyricID) : null);
});
const pandaLyricsAPI = {
    windowMoving: (x, y) => {
        electron_1.ipcRenderer.send('app:windowMoving', x, y);
    },
    setWindowPos: (x, y) => {
        electron_1.ipcRenderer.send('app:setWindowPos', x, y);
    },
    onSettingsOpen: (listener) => {
        electron_1.ipcRenderer.on('dialog:openSettings', listener);
        return () => electron_1.ipcRenderer.off('dialog:openSettings', listener);
    },
    addTickListener: (listener) => {
        electron_1.ipcRenderer.on('app:tick', (_event, value) => {
            listener(value);
        });
        return () => electron_1.ipcRenderer.off('app:tick', listener);
    },
    onSetMove: (listener) => {
        const handler = (_event, value) => {
            listener(value);
        };
        electron_1.ipcRenderer.on('app:setMove', handler);
        return () => electron_1.ipcRenderer.off('app:setMove', handler);
    },
    addLyricChangeListener: (listener) => {
        const handler = (_event, value) => {
            listener(value);
        };
        electron_1.ipcRenderer.on('app:setLyric', handler);
        return () => electron_1.ipcRenderer.off('app:setLyric', handler);
    },
    onSetVisible: (listener) => {
        const handler = (_event, value) => {
            listener(value);
        };
        electron_1.ipcRenderer.on('app:setVisible', handler);
        return () => electron_1.ipcRenderer.off('app:setVisible', handler);
    },
    setMove: (value) => {
        electron_1.ipcRenderer.send('app:setMove', value);
    },
    setVisible: (value) => {
        electron_1.ipcRenderer.send('app:setVisible', value);
    },
    updateHeight: () => {
        electron_1.ipcRenderer.send('app:updateHeight', document.body.clientHeight);
    },
    getAllSystemFonts() {
        return electron_1.ipcRenderer.sendSync('app:getAllSystemFonts');
    },
    getAutoStart() {
        return electron_1.ipcRenderer.sendSync('app:getAutoStart');
    },
    getWindowPos() {
        return electron_1.ipcRenderer.sendSync('app:getWindowPos');
    },
    setAutoStart(value) {
        electron_1.ipcRenderer.send('app:setAutoStart', value);
    },
    setWindowWidth(value) {
        electron_1.ipcRenderer.send('app:setWindowWidth', value);
    },
};
electron_1.contextBridge.exposeInMainWorld('pandaLyricsAPI', pandaLyricsAPI);
