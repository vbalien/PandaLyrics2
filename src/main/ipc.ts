import { ipcMain, Menu, MenuItem } from 'electron';
import { context } from './context';

export function setupIpc() {
  ipcMain.handle('app:setMove', (_ev, value: boolean) => {
    const menu = context.trayMenu?.getItem('moveMode');
    if (!menu || !context.trayMenu) return;
    menu.checked = value;
    context.tray?.setContextMenu(context.trayMenu.build());
  });

  ipcMain.handle('app:setVisible', (_ev, value: boolean) => {
    context.mainWindow?.setVisible(value);
  });

  ipcMain.handle('app:clearLyrics', () => {
    const menu = context.trayMenu?.getItem('lyrics');
    if (!menu || !context.trayMenu) return;
    menu.submenu = [];
    context.tray?.setContextMenu(context.trayMenu.build());
  });

  ipcMain.handle('app:setLyrics', (_ev, lyrics: LyricInfo[]) => {
    const menu = context.trayMenu?.getItem('lyrics');
    if (!menu || !context.trayMenu) return;

    menu.submenu = new Menu();
    for (const info of lyrics) {
      menu.submenu.append(
        new MenuItem({
          label: info.title,
          type: 'radio',
        })
      );
    }
    context.tray?.setContextMenu(context.trayMenu.build());
  });
}
