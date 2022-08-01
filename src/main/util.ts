import { context } from './';
import { trayMenu } from './menu';

export function setVisible(value: boolean) {
  const menu = trayMenu.getMenuItemById('appVisible');
  if (!menu) return;
  menu.checked = value;
  context.tray?.setContextMenu(trayMenu);

  if (value) {
    context.mainWindow?.show();
  } else {
    context.mainWindow?.hide();
  }
}
