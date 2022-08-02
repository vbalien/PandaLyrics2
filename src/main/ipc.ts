import { ipcMain, Menu, MenuItem, screen } from 'electron';
import { context } from './context';

export function setupIpc() {
  ipcMain.on('windowMoving', (_e, mouseX, mouseY) => {
    const { x, y } = screen.getCursorScreenPoint();
    context.mainWindow?.setPosition(x - mouseX, y - mouseY);
  });

  ipcMain.handle('app:setMove', (_ev, value: boolean) => {
    context.mainWindow?.setMoveMode(value);
  });

  ipcMain.handle('app:setVisible', (_ev, value: boolean) => {
    context.mainWindow?.setVisible(value);
  });

  ipcMain.handle('app:clearLyrics', () => {
    const menu = context.trayMenu?.getItem('lyrics');
    if (!menu) return;
    menu.submenu = [];
    context.trayMenu?.apply();
  });

  ipcMain.handle('app:setLyrics', (_ev, lyrics: LyricInfo[]) => {
    const menu = context.trayMenu?.getItem('lyrics');
    if (!menu) return;

    menu.submenu = new Menu();
    for (const info of lyrics) {
      menu.submenu.append(
        new MenuItem({
          label: info.title,
          type: 'radio',
        })
      );
    }
    context.trayMenu?.apply();
  });
}
