import { app, Menu, MenuItemConstructorOptions } from 'electron';

const name = app.name;

export const Separator: MenuItemConstructorOptions = {
  type: 'separator',
};

const darwinMenuItem: MenuItemConstructorOptions = {
  label: name,
  type: 'submenu',
  submenu: [
    {
      label: name + '에 대하여',
      role: 'about',
    },
    Separator,
    {
      label: '서비스',
      role: 'services',
    },
    Separator,
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
    Separator,
    {
      label: name + ' 끝내기',
      accelerator: 'Command+Q',
      click: function () {
        app.quit();
      },
    },
  ],
};

export function setApplicationMenu() {
  const template: MenuItemConstructorOptions[] = [];

  if (process.platform === 'darwin') {
    template.unshift(darwinMenuItem);
  }
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}
