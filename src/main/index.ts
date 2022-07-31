import { app, nativeImage, Tray } from 'electron';
import path from 'path';
import { createMainWindow, windowContext } from './window';
import { setApplicationMenu, trayMenu } from './menu';

let tray: Tray | null;

if (process.platform === 'darwin') {
  app.dock.hide();
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (windowContext.mainWindow === null) {
    windowContext.mainWindow = createMainWindow();
  }
});

app.on('ready', async () => {
  const iconPath = path.join(__dirname, '../assets/Icon-App-20x20.png');
  const icon = nativeImage.createFromPath(iconPath);
  tray = new Tray(icon);
  tray.setContextMenu(trayMenu);
  tray.setToolTip('PandaLyrics');

  windowContext.mainWindow = createMainWindow();
  setApplicationMenu();
});
