import {
  BrowserWindow,
  BrowserWindowConstructorOptions,
  HandlerDetails,
  screen,
} from 'electron';
import path from 'path';
import { AppContext } from './types';

const isDevelopment = process.env.NODE_ENV !== 'production';

export default class MainWindow extends BrowserWindow {
  static Preload = isDevelopment
    ? path.join(__dirname, '../../dist/preload.js')
    : path.join(__dirname, 'preload.js');
  static PageUrl = isDevelopment
    ? 'http://localhost:8080/'
    : `file://${path.join(__dirname, '../renderer/index.html')}`;

  constructor(private context: AppContext) {
    const primaryDisplay = screen.getPrimaryDisplay();
    super({
      frame: false,
      transparent: true,
      minimizable: false,
      maximizable: false,
      resizable: false,
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
    this.webContents.on('devtools-opened', this.onDevtoolsOpened.bind(this));
    this.webContents.setWindowOpenHandler(this.windowOpenHandler.bind(this));

    if (isDevelopment) {
      this.webContents.openDevTools();
    }

    const pageUrl = new URL(MainWindow.PageUrl);
    pageUrl.hash = '#main';
    this.loadURL(pageUrl.href);
  }

  windowOpenHandler(handlerDetails: HandlerDetails) {
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

  onClosed() {
    this.context.mainWindow = null;
  }

  onDevtoolsOpened() {
    this.focus();
  }

  setMoveMode(value: boolean, request?: boolean) {
    this.setIgnoreMouseEvents(!value);
    const menu = this.context.trayMenu?.getItem('moveMode');
    if (!menu || !this.context.trayMenu) return;
    menu.checked = value;
    this.context.tray?.setContextMenu(this.context.trayMenu.build());

    if (request) {
      this.context.mainWindow?.webContents.send('app:setMove', value);
    }
  }

  requestSettingsOpen() {
    this.context.mainWindow?.webContents.send('dialog:openSettings');
  }

  show() {
    super.show();
    const menu = this.context.trayMenu?.getItem('appVisible');
    if (!menu || !this.context.trayMenu) return;
    menu.checked = true;
    this.context.tray?.setContextMenu(this.context.trayMenu.build());
  }

  hide() {
    super.hide();
    const menu = this.context.trayMenu?.getItem('appVisible');
    if (!menu || !this.context.trayMenu) return;
    menu.checked = false;
    this.context.tray?.setContextMenu(this.context.trayMenu.build());
  }

  setVisible(value: boolean, request?: boolean) {
    if (value) {
      this.show();
    } else {
      this.hide();
    }
    if (request) {
      this.context.mainWindow?.webContents.send('app:setVisible', value);
    }
  }
}
