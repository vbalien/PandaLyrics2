import { app, Menu, MenuItemConstructorOptions, Tray } from 'electron';
import { injectable } from 'inversify';
import { LyricData } from './alsong';
import { lazyInject } from './inversify.config';
import { checkExtension, installExtension } from './extension-installer';
import MainWindow from './main-window';
import { Separator } from './menu';
import { TYPES } from './types';

@injectable()
export default class TrayMenu {
  @lazyInject(TYPES.MainWindow)
  private mainWindow!: MainWindow;
  @lazyInject(TYPES.Tray)
  private tray!: Tray;

  private _menu?: Menu;
  private raw: MenuItemConstructorOptions[] = [
    {
      label: '표시',
      type: 'checkbox',
      id: 'appVisible',
      click: menuItem => {
        this.mainWindow.setVisible(menuItem.checked, true);
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
        this.mainWindow.setMoveMode(menuItem.checked, true);
      },
    },
    {
      label: '환경설정',
      type: 'normal',
      id: 'settings',
      click: () => {
        this.mainWindow.requestSettingsOpen();
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

  async updateInstallMenu() {
    const installMenuIdx = this.raw.findIndex(item => item.id === 'install');
    const settingsMenuIdx = this.raw.findIndex(item => item.id === 'settings');

    if (!(await checkExtension())) {
      if (settingsMenuIdx === -1 || installMenuIdx !== -1) {
        return;
      }
      this.raw.splice(settingsMenuIdx + 1, 0, {
        label: 'extension 설치',
        type: 'normal',
        id: 'install',
        click: async () => {
          await installExtension(this.mainWindow);
          this.updateInstallMenu();
        },
      });
      this.apply();
    } else {
      if (installMenuIdx === -1) {
        return;
      }
      this.raw.splice(installMenuIdx, 1);
      this.apply();
    }
  }

  getItem(id: string): MenuItemConstructorOptions | undefined {
    return this.raw.find(item => item.id === id);
  }

  setLyricsItemCheck(id: string) {
    const lyricsMenu = this.getItem('lyrics');
    if (!lyricsMenu?.submenu || !(lyricsMenu?.submenu instanceof Array)) {
      return;
    }
    for (const item of lyricsMenu.submenu) {
      if (item.id === id) {
        item.checked = true;
      } else {
        item.checked = false;
      }
    }
    this.apply();
  }

  get menu() {
    return this._menu;
  }

  private build(): Menu {
    this._menu = Menu.buildFromTemplate(this.raw);
    return this._menu;
  }

  apply(): void {
    this.tray.setContextMenu(this.build());
  }

  setLyrics(lyrics: LyricData[]) {
    const menu = this.getItem('lyrics');
    if (!menu) return;

    menu.submenu = [];
    for (const lyric of lyrics) {
      menu.submenu.push({
        id: lyric.lyricID.toString(),
        label: `${lyric.title} - ${lyric.artist} [${lyric.album}]`,
        type: 'radio',
        click: menuItem => {
          this.mainWindow.setLyric(Number.parseInt(menuItem.id));
        },
      });
    }

    if (lyrics.length > 0) {
      menu.submenu.push({
        id: '-1',
        label: `선택 안함`,
        type: 'radio',
        click: menuItem => {
          this.mainWindow.setLyric(Number.parseInt(menuItem.id));
        },
      });
    }
  }

  setVisibleCheck(value: boolean) {
    const menu = this.getItem('appVisible');
    if (!menu) return;
    menu.checked = value;
    this.tray.setContextMenu(this.build());
  }

  setMoveModeCheck(value: boolean) {
    const menu = this.getItem('moveMode');
    if (!menu) return;
    menu.checked = value;
    this.tray.setContextMenu(this.build());
  }
}
