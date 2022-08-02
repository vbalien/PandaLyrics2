import { app, Menu, MenuItemConstructorOptions } from 'electron';
import { Context } from 'vm';
import { Separator } from './menu';

export default class TrayMenu {
  private raw: MenuItemConstructorOptions[] = [
    {
      label: '표시',
      type: 'checkbox',
      id: 'appVisible',
      click: menuItem => {
        this.context.mainWindow?.setVisible(menuItem.checked);
      },
    },
    Separator,
    { label: '가사 선택', type: 'submenu', id: 'lyrics', submenu: [] },
    Separator,
    {
      label: '위치 이동',
      type: 'checkbox',
      id: 'moveMode',
      click: menuItem => {
        this.context.mainWindow?.webContents.send(
          'app:setMove',
          menuItem.checked
        );
      },
    },
    {
      label: '환경설정',
      type: 'normal',
      id: 'settings',
      click: () => {
        this.context.mainWindow?.webContents.send('dialog:openSettings');
      },
    },
    Separator,
    {
      label: '종료',
      type: 'normal',
      id: 'exit',
      click: () => {
        app.quit();
      },
    },
  ];
  private _menu: Menu = new Menu();

  constructor(private context: Context) {}

  getItem(id: string): MenuItemConstructorOptions | null {
    for (const item of this.raw) {
      if (item.id === id) {
        return item;
      }
    }
    return null;
  }

  build(): Menu {
    this._menu = Menu.buildFromTemplate(this.raw);
    return this.menu;
  }

  get menu() {
    return this._menu;
  }
}
