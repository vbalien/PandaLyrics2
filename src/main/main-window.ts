import {
  BrowserWindow,
  BrowserWindowConstructorOptions,
  HandlerDetails,
  ipcMain,
  screen,
} from 'electron';
import path from 'path';
import { WebSocketServer } from 'webpack-dev-server';
import { getLyricById, getLyricList, LyricDetailData } from './alsong';
import { AppContext } from './types';
import { setupWebsocket, SongChangeMessage, TickMessage } from './websocket';

const isDevelopment = process.env.NODE_ENV !== 'production';

export default class MainWindow extends BrowserWindow {
  static Preload = isDevelopment
    ? path.join(__dirname, '../../dist/preload.js')
    : path.join(__dirname, 'preload.js');
  static PageUrl = isDevelopment
    ? 'http://localhost:8080/'
    : `file://${path.join(__dirname, '../renderer/index.html')}`;
  private wss?: WebSocketServer;
  private currSongID?: string;
  private currTime?: number;
  private currLyric: LyricDetailData | null = null;

  constructor(private context: AppContext) {
    const primaryDisplay = screen.getPrimaryDisplay();
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
      height: 150,
      x: primaryDisplay.size.width - 600 - 30,
      y: primaryDisplay.size.height - 150 - 30,
    });

    this.setAlwaysOnTop(true, 'screen-saver');
    this.setVisibleOnAllWorkspaces(true);
    this.setIgnoreMouseEvents(true);
    this.setMenu(null);
    this.setMenuBarVisibility(false);

    this.on('closed', this.onClosed.bind(this));
    this.on('ready-to-show', this.onReadyToShow.bind(this));
    this.webContents.on('devtools-opened', this.onDevtoolsOpened.bind(this));
    this.webContents.setWindowOpenHandler(this.onWindowOpen.bind(this));

    if (isDevelopment) {
      this.webContents.openDevTools();
    }

    const pageUrl = new URL(MainWindow.PageUrl);
    pageUrl.hash = '#main';
    this.loadURL(pageUrl.href);
  }

  private onReadyToShow() {
    this.wss = setupWebsocket({
      songChangeEvent: this.onSongChange.bind(this),
      tickEvent: this.onTick.bind(this),
      closeEvent: this.onWsClose.bind(this),
    });
    this.context.trayMenu?.updateInstallMenu();
  }

  private onWindowOpen(handlerDetails: HandlerDetails) {
    const pageUrl = new URL(MainWindow.PageUrl);
    const handleUrl = new URL(handlerDetails.url);

    pageUrl.hash = '#settings';
    if (pageUrl.href === handleUrl.href) {
      return {
        action: 'allow' as const,
        overrideBrowserWindowOptions: {
          width: 400,
          height: 600,
          resizable: false,
          maximizable: false,
          minimizable: false,
          webPreferences: {
            preload: MainWindow.Preload,
          },
        } as BrowserWindowConstructorOptions,
      };
    }
    return { action: 'deny' as const };
  }

  close() {
    this.wss?.close();
    super.close();
  }

  private onClosed() {
    this.context.mainWindow = null;
  }

  private onDevtoolsOpened() {
    this.focus();
  }

  setMoveMode(value: boolean, request?: boolean) {
    this.setIgnoreMouseEvents(!value);
    this.context.trayMenu?.setMoveModeCheck(value);

    if (request) {
      this.webContents.send('app:setMove', value);
    }
  }

  requestSettingsOpen() {
    this.webContents.send('dialog:openSettings');
  }

  setHistory(songID: string, lyricID: number) {
    this.webContents.send('app:setHistory', songID, lyricID);
  }

  async getHistory(songID: string) {
    return new Promise<number | null>(resolve => {
      const listener = (_ev: unknown, lyricID: number) => {
        ipcMain.off('app:getHistory', listener);
        resolve(lyricID);
      };
      ipcMain.on('app:getHistory', listener);
      this.webContents.send('app:getHistory', songID);
    });
  }

  show() {
    super.show();
    this.context.trayMenu?.setVisibleCheck(true);
  }

  hide() {
    super.hide();
    this.context.trayMenu?.setVisibleCheck(false);
  }

  setVisible(value: boolean, request?: boolean) {
    if (value) {
      this.show();
    } else {
      this.hide();
    }
    if (request) {
      this.webContents.send('app:setVisible', value);
    }
  }

  async setLyric(lyric: number | LyricDetailData | null) {
    let lyricData: LyricDetailData | null;
    if (lyric === null) {
      this.webContents.send('app:setLyric', null);
      return;
    }

    if (typeof lyric === 'number') {
      this.context.trayMenu?.setLyricsItemCheck(lyric.toString());
      lyricData = await getLyricById(lyric);
    } else {
      lyricData = lyric;
    }
    if (lyricData && this.currSongID) {
      this.setHistory(this.currSongID, lyricData.lyricID);
    }
    this.webContents.send('app:setLyric', lyricData);
    this.currLyric = lyricData;
  }

  private async onSongChange({ data }: SongChangeMessage) {
    if (this.currSongID === data.songID) {
      this.setLyric(this.currLyric);
      return;
    }
    this.currSongID = data.songID;

    let lyrics = await getLyricList({
      title: data.title,
      artist: data.artist,
    });

    if (lyrics.length === 0) {
      lyrics = await getLyricList({
        title: data.title,
      });
    }

    this.context.trayMenu?.setLyrics(lyrics);

    const savedLyricID = await this.getHistory(data.songID);

    this.context.trayMenu?.apply();
    if (savedLyricID) {
      this.setLyric(savedLyricID);
    } else if (lyrics.length === 0) {
      this.setLyric(null);
    } else {
      this.setLyric(lyrics[0].lyricID);
    }
  }

  private onTick({ data: { time } }: TickMessage) {
    if (this.currTime === time) {
      return;
    }
    this.currTime = time;
    this.webContents.send('app:tick', time);
  }

  private onWsClose() {
    this.setLyric(null);
  }
}
