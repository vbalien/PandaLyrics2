"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setApplicationMenu = exports.Separator = void 0;
const electron_1 = require("electron");
const name = electron_1.app.name;
exports.Separator = {
    type: 'separator',
};
const darwinMenuItem = {
    label: name,
    type: 'submenu',
    submenu: [
        {
            label: name + '에 대하여',
            role: 'about',
        },
        exports.Separator,
        {
            label: '서비스',
            role: 'services',
        },
        exports.Separator,
        {
            label: name + ' 숨기기',
            accelerator: 'Command+H',
            role: 'hide',
        },
        {
            label: '기타항목 숨기기',
            accelerator: 'Command+Shift+H',
            role: 'hideOthers',
        },
        {
            label: '모두 표시',
            role: 'unhide',
        },
        exports.Separator,
        {
            label: name + ' 끝내기',
            accelerator: 'Command+Q',
            click: function () {
                electron_1.app.quit();
            },
        },
    ],
};
function setApplicationMenu() {
    const template = [];
    if (process.platform === 'darwin') {
        template.unshift(darwinMenuItem);
    }
    electron_1.Menu.setApplicationMenu(electron_1.Menu.buildFromTemplate(template));
}
exports.setApplicationMenu = setApplicationMenu;
