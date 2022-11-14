import { app, ipcMain, screen } from 'electron';
import { getFonts } from 'font-list';
import MainWindow from './main-window';

export function setupIpc(mainWindow: MainWindow) {
  ipcMain.on('app:windowMoving', (_e, mouseX, mouseY) => {
    const { x, y } = screen.getCursorScreenPoint();
    mainWindow.setPosition(x - mouseX, y - mouseY);
  });

  ipcMain.on('app:setWindowPos', (_e, x, y) => {
    if (!mainWindow) {
      return;
    }
    const [curX, curY] = mainWindow.getPosition();
    mainWindow.setPosition(x ?? curX, y ?? curY);
  });

  ipcMain.on('app:setMove', (_ev, value: boolean) => {
    mainWindow.setMoveMode(value);
  });

  ipcMain.on('app:setVisible', (_ev, value: boolean) => {
    mainWindow.setVisible(value);
  });

  ipcMain.on('app:updateHeight', (_ev, height: number) => {
    mainWindow.setSize(mainWindow.getSize()[0], height);
  });

  ipcMain.on('app:getAllSystemFonts', async ev => {
    ev.returnValue = await getFonts();
  });

  ipcMain.on('app:getWindowPos', ev => {
    ev.returnValue = mainWindow.getPosition();
  });

  ipcMain.on('app:getAutoStart', ev => {
    ev.returnValue = app.getLoginItemSettings({
      path: app.getPath('exe'),
    }).openAtLogin;
  });

  ipcMain.on('app:setAutoStart', (_ev, value: boolean) => {
    app.setLoginItemSettings({
      path: app.getPath('exe'),
      openAtLogin: value,
    });
  });

  ipcMain.on('app:setWindowWidth', (_ev, width: number) => {
    if (!mainWindow) {
      return;
    }
    const [, height] = mainWindow.getSize();
    mainWindow.setSize(width, height);
  });
}
