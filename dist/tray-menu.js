"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const extension_installer_1 = require("./extension-installer");
const menu_1 = require("./menu");
class TrayMenu {
    constructor(context) {
        this.context = context;
        this.raw = [
            {
                label: '표시',
                type: 'checkbox',
                id: 'appVisible',
                click: menuItem => {
                    this.context.mainWindow?.setVisible(menuItem.checked, true);
                },
            },
            menu_1.Separator,
            { label: '가사 선택', type: 'submenu', id: 'lyrics', submenu: [] },
            menu_1.Separator,
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
            menu_1.Separator,
            {
                label: '종료',
                type: 'normal',
                id: 'exit',
                click: () => {
                    electron_1.app.quit();
                },
            },
        ];
    }
    async updateInstallMenu() {
        const installMenuIdx = this.raw.findIndex(item => item.id === 'install');
        const settingsMenuIdx = this.raw.findIndex(item => item.id === 'settings');
        if (!(await (0, extension_installer_1.checkExtension)())) {
            if (settingsMenuIdx === -1 || installMenuIdx !== -1) {
                return;
            }
            this.raw.splice(settingsMenuIdx + 1, 0, {
                label: 'extension 설치',
                type: 'normal',
                id: 'install',
                click: async () => {
                    await (0, extension_installer_1.installExtension)();
                    this.updateInstallMenu();
                },
            });
            this.apply();
        }
        else {
            if (installMenuIdx === -1) {
                return;
            }
            this.raw.splice(installMenuIdx, 1);
            this.apply();
        }
    }
    getItem(id) {
        return this.raw.find(item => item.id === id);
    }
    setLyricsItemCheck(id) {
        const lyricsMenu = this.getItem('lyrics');
        if (!lyricsMenu?.submenu || !(lyricsMenu?.submenu instanceof Array)) {
            return;
        }
        for (const item of lyricsMenu.submenu) {
            if (item.id === id) {
                item.checked = true;
            }
            else {
                item.checked = false;
            }
        }
        this.apply();
    }
    get menu() {
        return this._menu;
    }
    build() {
        this._menu = electron_1.Menu.buildFromTemplate(this.raw);
        return this._menu;
    }
    apply() {
        this.context.tray?.setContextMenu(this.build());
    }
    setLyrics(lyrics) {
        const menu = this.getItem('lyrics');
        if (!menu)
            return;
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
        if (lyrics.length > 0) {
            menu.submenu.push({
                id: '-1',
                label: `선택 안함`,
                type: 'radio',
                click: menuItem => {
                    this.context.mainWindow?.setLyric(Number.parseInt(menuItem.id));
                },
            });
        }
    }
    setVisibleCheck(value) {
        const menu = this.getItem('appVisible');
        if (!menu)
            return;
        menu.checked = value;
        this.context.tray?.setContextMenu(this.build());
    }
    setMoveModeCheck(value) {
        const menu = this.getItem('moveMode');
        if (!menu)
            return;
        menu.checked = value;
        this.context.tray?.setContextMenu(this.build());
    }
}
exports.default = TrayMenu;
