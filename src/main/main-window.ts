import { BrowserWindow, screen } from 'electron';
import path from 'path';
import { AppContext } from './types';

const isDevelopment = process.env.NODE_ENV !== 'production';

export default class MainWindow extends BrowserWindow {
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
        preload: isDevelopment
          ? path.join(__dirname, '../../dist/preload.js')
          : path.join(__dirname, 'preload.js'),
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
    this.webContents.on('did-finish-load', this.onDidFinishLoad.bind(this));
    this.webContents.on('devtools-opened', this.onDevtoolsOpened.bind(this));

    if (isDevelopment) {
      this.webContents.openDevTools();
    }

    if (isDevelopment) {
      this.loadURL(`http://localhost:8080/#main`);
    } else {
      this.loadURL(
        `file://${path.join(__dirname, '../renderer/index.html')}#main`
      );
    }
  }

  onClosed() {
    this.context.mainWindow = null;
  }

  onDidFinishLoad() {
    this.show();
    this.focus();
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

  setVisible(value: boolean) {
    if (value) {
      this.show();
    } else {
      this.hide();
    }
  }
}
