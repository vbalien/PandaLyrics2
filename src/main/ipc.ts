import { ipcMain, MenuItem } from 'electron';
import { context } from './';
import { trayMenu } from './menu';
import { setVisible } from './util';

export function setupIpc() {
  ipcMain.handle('app:setMove', (_ev, value: boolean) => {
    const menu = trayMenu.getMenuItemById('moveMode');
    if (!menu) return;
    menu.checked = value;
    context.tray?.setContextMenu(trayMenu);
  });

  ipcMain.handle('app:setVisible', (_ev, value: boolean) => {
    setVisible(value);
  });

  ipcMain.handle('app:clearLyrics', () => {
    const menu = trayMenu.getMenuItemById('lyrics');
    if (!menu || !menu.submenu) return;
    menu.submenu.items = [];
    context.tray?.setContextMenu(trayMenu);
  });

  ipcMain.handle('app:setLyrics', (_ev, lyrics: LyricInfo[]) => {
    const menu = trayMenu.getMenuItemById('lyrics');
    if (!menu || !menu.submenu) return;

    for (const info of lyrics) {
      menu.submenu.append(
        new MenuItem({
          label: info.title,
          type: 'radio',
        })
      );
    }
    context.tray?.setContextMenu(trayMenu);
  });
}
