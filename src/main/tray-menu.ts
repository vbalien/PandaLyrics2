import { app, Menu, MenuItemConstructorOptions } from 'electron';
import { LyricData } from './alsong';
import { checkExtension, installExtension } from './extension-installer';
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

  constructor(private context: AppContext) {}

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
          await installExtension();
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

  build(): Menu {
    return Menu.buildFromTemplate(this.raw);
  }

  apply(): void {
    this.context.tray?.setContextMenu(this.build());
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
}
