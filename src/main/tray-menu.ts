import { app, Menu, MenuItemConstructorOptions } from 'electron';
import { LyricData } from './alsong';
import { Separator } from './menu';
import { AppContext } from './types';

export default class TrayMenu {
  private raw: MenuItemConstructorOptions[] = [
    {
      label: '표시',
      type: 'checkbox',
      id: 'appVisible',
      click: menuItem => {
        this.context.mainWindow?.setVisible(menuItem.checked, true);
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

  build(): Menu {
    this._menu = Menu.buildFromTemplate(this.raw);
    return this.menu;
  }

  apply(): void {
    this.build();
    this.context.tray?.setContextMenu(this._menu);
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
          this.context.mainWindow?.setLyric(Number.parseInt(menuItem.id));
        },
      });
    }

    if (lyrics.length === 0) {
      this.apply();
    } else {
      this.context.mainWindow?.setLyric(lyrics[0].lyricID);
    }
  }

  setVisibleCheck(value: boolean) {
    const menu = this.getItem('appVisible');
    if (!menu) return;
    menu.checked = value;
    this.context.tray?.setContextMenu(this.build());
  }

  setMoveModeCheck(value: boolean) {
    const menu = this.getItem('moveMode');
    if (!menu) return;
    menu.checked = value;
    this.context.tray?.setContextMenu(this.build());
  }

  get menu() {
    return this._menu;
  }
}
