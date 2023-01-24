"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path_1 = __importDefault(require("path"));
const alsong_1 = require("./alsong");
const ipc_1 = require("./ipc");
const websocket_1 = require("./websocket");
const isDevelopment = process.env.NODE_ENV !== 'production';
class MainWindow extends electron_1.BrowserWindow {
    constructor(context) {
        const primaryDisplay = electron_1.screen.getPrimaryDisplay();
        super({
            frame: false,
            transparent: true,
            minimizable: false,
            maximizable: false,
            resizable: true,
            roundedCorners: false,
            show: false,
            hasShadow: false,
            skipTaskbar: true,
            webPreferences: {
                preload: MainWindow.Preload,
            },
            useContentSize: true,
            width: 600,
            height: 300,
            x: primaryDisplay.size.width - 600 - 30,
            y: primaryDisplay.size.height - 300 - 30,
        });
        this.context = context;
        this.currLyric = null;
        this.setAlwaysOnTop(true, 'screen-saver');
        this.setVisibleOnAllWorkspaces(true, {
            visibleOnFullScreen: true,
            skipTransformProcessType: true,
        });
        this.setIgnoreMouseEvents(true);
        this.setMenu(null);
        this.setMenuBarVisibility(false);
        this.on('closed', this.onClosed.bind(this));
        this.on('ready-to-show', this.onReadyToShow.bind(this));
        this.webContents.on('devtools-opened', this.onDevtoolsOpened.bind(this));
        this.on('close', this.onClose.bind(this));
        this.webContents.setWindowOpenHandler(this.onWindowOpen.bind(this));
        if (isDevelopment) {
            this.webContents.openDevTools({
                mode: 'detach',
            });
        }
        const pageUrl = new URL(MainWindow.PageUrl);
        pageUrl.hash = '#main';
        this.loadURL(pageUrl.href);
    }
    onReadyToShow() {
        (0, ipc_1.setupIpc)();
        this.wss = (0, websocket_1.setupWebsocket)({
            changeSongEvent: this.onChangeSong.bind(this),
            changeStateEvent: this.onChangeState.bind(this),
            tickEvent: this.onTick.bind(this),
            closeEvent: this.onWsClose.bind(this),
        });
        this.context.trayMenu?.updateInstallMenu();
    }
    onWindowOpen(handlerDetails) {
        const pageUrl = new URL(MainWindow.PageUrl);
        const handleUrl = new URL(handlerDetails.url);
        pageUrl.hash = '#settings';
        if (pageUrl.href === handleUrl.href) {
            return {
                action: 'allow',
                overrideBrowserWindowOptions: {
                    width: 400,
                    height: 600,
                    resizable: false,
                    maximizable: false,
                    minimizable: false,
                    webPreferences: {
                        preload: MainWindow.Preload,
                    },
                },
            };
        }
        return { action: 'deny' };
    }
    onClose() {
        this.wss?.close();
    }
    onClosed() {
        this.context.mainWindow = null;
    }
    onDevtoolsOpened() {
        this.focus();
    }
    setMoveMode(value, request) {
        this.setIgnoreMouseEvents(!value);
        this.context.trayMenu?.setMoveModeCheck(value);
        if (request) {
            this.webContents.send('app:setMove', value);
        }
    }
    requestSettingsOpen() {
        this.webContents.send('dialog:openSettings');
    }
    setHistory(songID, lyricID) {
        this.webContents.send('app:setHistory', songID, lyricID);
    }
    async getHistory(songID) {
        return new Promise(resolve => {
            const listener = (_ev, lyricID) => {
                electron_1.ipcMain.off('app:getHistory', listener);
                resolve(lyricID);
            };
            electron_1.ipcMain.on('app:getHistory', listener);
            this.webContents.send('app:getHistory', songID);
        });
    }
    show() {
        super.showInactive();
        this.context.trayMenu?.setVisibleCheck(true);
    }
    hide() {
        super.hide();
        this.context.trayMenu?.setVisibleCheck(false);
    }
    setVisible(value, request) {
        if (value) {
            this.show();
        }
        else {
            this.hide();
        }
        if (request) {
            this.webContents.send('app:setVisible', value);
        }
    }
    async setLyric(lyric) {
        let lyricData;
        if (lyric === null || !this.currSongID) {
            this.webContents.send('app:setLyric', null);
            return;
        }
        if (typeof lyric === 'number') {
            this.context.trayMenu?.setLyricsItemCheck(lyric.toString());
            if (lyric === -1) {
                lyricData = null;
            }
            else {
                lyricData = await (0, alsong_1.getLyricById)(lyric);
            }
        }
        else {
            lyricData = lyric;
        }
        if (lyricData) {
            this.setHistory(this.currSongID, lyricData.lyricID);
        }
        else if (lyric === -1) {
            this.setHistory(this.currSongID, lyric);
        }
        this.webContents.send('app:setLyric', lyricData);
        this.currLyric = lyricData;
    }
    async onChangeState({ data }) {
        if (data.is_paused) {
            this.setLyric(null);
        }
        else {
            this.setLyric(this.currLyric);
        }
    }
    async onChangeSong({ data }) {
        if (this.currSongID === data.songID) {
            await this.setLyric(this.currLyric);
        }
        else {
            this.currSongID = data.songID;
            let lyrics = await (0, alsong_1.getLyricList)({
                title: data.title,
                artist: data.artist,
            });
            if (lyrics.length === 0) {
                lyrics = await (0, alsong_1.getLyricList)({
                    title: data.title,
                });
            }
            this.context.trayMenu?.setLyrics(lyrics);
            const savedLyricID = await this.getHistory(data.songID);
            this.context.trayMenu?.apply();
            if (savedLyricID) {
                await this.setLyric(savedLyricID);
            }
            else if (lyrics.length === 0) {
                await this.setLyric(null);
            }
            else {
                await this.setLyric(lyrics[0].lyricID);
            }
        }
        if (data.is_paused) {
            await this.setLyric(null);
        }
    }
    onTick({ data: { time } }) {
        if (!this || this.currTime === time || !this.webContents) {
            return;
        }
        this.currTime = time;
        this.webContents.send('app:tick', time);
    }
    onWsClose() {
        this.setLyric(null);
    }
}
exports.default = MainWindow;
MainWindow.Preload = isDevelopment
    ? path_1.default.join(__dirname, 'preload.js')
    : path_1.default.join(__dirname, 'preload.js');
MainWindow.PageUrl = isDevelopment
    ? 'http://localhost:5173/'
    : `file://${path_1.default.join(__dirname, '../renderer/index.html')}`;
