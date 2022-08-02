import { app, Menu, MenuItemConstructorOptions } from 'electron';
import { Separator } from './menu';
import { AppContext } from './types';

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
        this.context.mainWindow?.setMoveMode(menuItem.checked, true);
      },
    },
    {
      label: '환경설정',
      type: 'normal',
      id: 'settings',
      click: () => {
        this.context.mainWindow?.requestSettingsOpen();
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

  constructor(private context: AppContext) {}

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

  apply(): void {
    this.build();
    this.context.tray?.setContextMenu(this._menu);
  }

  get menu() {
    return this._menu;
  }
}
