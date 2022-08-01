import { app, BrowserWindow, nativeImage, Tray } from 'electron';
import path from 'path';
import { createMainWindow } from './window';
import { setApplicationMenu, trayMenu } from './menu';
import { setupIpc } from './ipc';

export const context: {
  mainWindow: BrowserWindow | null;
  tray: Tray | null;
} = {
  mainWindow: null,
  tray: null,
};

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
    context.mainWindow = createMainWindow();
  }
});

app.on('ready', async () => {
  const iconPath = path.join(__dirname, '../assets/Icon-App-20x20.png');
  const icon = nativeImage.createFromPath(iconPath);
  const tray = (context.tray = new Tray(icon));
  tray.setContextMenu(trayMenu);
  tray.setToolTip('PandaLyrics');

  setupIpc();
  context.mainWindow = createMainWindow();
  setApplicationMenu();
});
