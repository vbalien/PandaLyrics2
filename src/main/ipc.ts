import { app, ipcMain, screen } from 'electron';
import { getFonts } from 'font-list';
import { context } from './context';

export function setupIpc() {
  ipcMain.on('app:windowMoving', (_e, mouseX, mouseY) => {
    const { x, y } = screen.getCursorScreenPoint();
    context.mainWindow?.setPosition(x - mouseX, y - mouseY);
  });

  ipcMain.on('app:setWindowPos', (_e, x, y) => {
    if (!context.mainWindow) {
      return;
    }
    const [curX, curY] = context.mainWindow.getPosition();
    context.mainWindow.setPosition(x ?? curX, y ?? curY);
  });

  ipcMain.on('app:setMove', (_ev, value: boolean) => {
    context.mainWindow?.setMoveMode(value);
  });

  ipcMain.on('app:setVisible', (_ev, value: boolean) => {
    context.mainWindow?.setVisible(value);
  });

  ipcMain.on('app:updateHeight', (_ev, height: number) => {
    context.mainWindow?.setSize(context.mainWindow?.getSize()[0], height);
  });

  ipcMain.on('app:getAllSystemFonts', async ev => {
    ev.returnValue = await getFonts();
  });

  ipcMain.on('app:getWindowPos', ev => {
    ev.returnValue = context.mainWindow?.getPosition();
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
}
