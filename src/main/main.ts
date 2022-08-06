import { app, nativeImage, Tray } from 'electron';
import path from 'path';
import fixPath from 'fix-path';
import PandaLyricsWindow from './main-window';
import { setApplicationMenu } from './menu';
import { context } from './context';
import TrayMenu from './tray-menu';

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  fixPath();

  if (process.platform === 'darwin') {
    app.dock.hide();
  }

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    if (context.mainWindow === null) {
      context.mainWindow = new PandaLyricsWindow(context);
    }
  });

  app.on('ready', async () => {
    const iconPath = path.join(__dirname, '../../assets/Icon-App-20x20.png');
    const icon = nativeImage.createFromPath(iconPath);
    const tray = (context.tray = new Tray(icon));
    const trayMenu = (context.trayMenu = new TrayMenu(context));
    tray.setContextMenu(trayMenu.build());
    tray.setToolTip('PandaLyrics');

    context.mainWindow = new PandaLyricsWindow(context);
    setApplicationMenu();
  });
}
