"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupIpc = void 0;
const electron_1 = require("electron");
const font_list_1 = require("font-list");
const context_1 = require("./context");
function setupIpc() {
    electron_1.ipcMain.on('app:windowMoving', (_e, mouseX, mouseY) => {
        const { x, y } = electron_1.screen.getCursorScreenPoint();
        context_1.context.mainWindow?.setPosition(x - mouseX, y - mouseY);
    });
    electron_1.ipcMain.on('app:setWindowPos', (_e, x, y) => {
        if (!context_1.context.mainWindow) {
            return;
        }
        const [curX, curY] = context_1.context.mainWindow.getPosition();
        context_1.context.mainWindow.setPosition(x ?? curX, y ?? curY);
    });
    electron_1.ipcMain.on('app:setMove', (_ev, value) => {
        context_1.context.mainWindow?.setMoveMode(value);
    });
    electron_1.ipcMain.on('app:setVisible', (_ev, value) => {
        context_1.context.mainWindow?.setVisible(value);
    });
    electron_1.ipcMain.on('app:updateHeight', (_ev, height) => {
        context_1.context.mainWindow?.setSize(context_1.context.mainWindow?.getSize()[0], height);
    });
    electron_1.ipcMain.on('app:getAllSystemFonts', async (ev) => {
        ev.returnValue = await (0, font_list_1.getFonts)();
    });
    electron_1.ipcMain.on('app:getWindowPos', ev => {
        ev.returnValue = context_1.context.mainWindow?.getPosition();
    });
    electron_1.ipcMain.on('app:getAutoStart', ev => {
        ev.returnValue = electron_1.app.getLoginItemSettings({
            path: electron_1.app.getPath('exe'),
        }).openAtLogin;
    });
    electron_1.ipcMain.on('app:setAutoStart', (_ev, value) => {
        electron_1.app.setLoginItemSettings({
            path: electron_1.app.getPath('exe'),
            openAtLogin: value,
        });
    });
    electron_1.ipcMain.on('app:setWindowWidth', (_ev, width) => {
        if (!context_1.context.mainWindow) {
            return;
        }
        const [, height] = context_1.context.mainWindow.getSize();
        context_1.context.mainWindow.setSize(width, height);
    });
}
exports.setupIpc = setupIpc;
