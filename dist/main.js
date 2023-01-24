"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path_1 = __importDefault(require("path"));
const fix_path_1 = __importDefault(require("fix-path"));
const main_window_1 = __importDefault(require("./main-window"));
const menu_1 = require("./menu");
const context_1 = require("./context");
const tray_menu_1 = __importDefault(require("./tray-menu"));
const gotTheLock = electron_1.app.requestSingleInstanceLock();
if (!gotTheLock) {
    electron_1.app.quit();
}
else {
    (0, fix_path_1.default)();
    if (process.platform === 'darwin') {
        electron_1.app.dock.hide();
    }
    electron_1.app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
            electron_1.app.quit();
        }
    });
    electron_1.app.on('activate', () => {
        if (context_1.context.mainWindow === null) {
            context_1.context.mainWindow = new main_window_1.default(context_1.context);
        }
    });
    electron_1.app.on('ready', async () => {
        const iconPath = path_1.default.join(__dirname, '../../assets/Icon-App-20x20.png');
        const icon = electron_1.nativeImage.createFromPath(iconPath);
        const tray = (context_1.context.tray = new electron_1.Tray(icon));
        const trayMenu = (context_1.context.trayMenu = new tray_menu_1.default(context_1.context));
        trayMenu.apply();
        tray.setToolTip('PandaLyrics');
        tray.on('double-click', () => {
            context_1.context.trayMenu?.menu?.getMenuItemById('appVisible')?.click();
        });
        context_1.context.mainWindow = new main_window_1.default(context_1.context);
        (0, menu_1.setApplicationMenu)();
    });
}
