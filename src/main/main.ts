import 'reflect-metadata';
import { app } from 'electron';
import fixPath from 'fix-path';
import { setApplicationMenu } from './menu';
import { TYPES } from './types';
import MainWindow from './main-window';
import { container } from './inversify.config';

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
    container.get<MainWindow>(TYPES.MainWindow).show();
  });

  app.on('ready', async () => {
    container.get<MainWindow>(TYPES.MainWindow);
    setApplicationMenu();
  });
}
