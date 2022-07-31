import { app, Menu, MenuItemConstructorOptions } from 'electron';

const name = app.name;

const Separator: MenuItemConstructorOptions = {
  type: 'separator',
};

const commonMenuItems: MenuItemConstructorOptions[] = [
  {
    label: '파일',
    submenu: [
      {
        label: '열기',
        accelerator: 'CmdOrCtrl+O',
        click() {
          return;
        },
      },
      Separator,
      {
        label: '저장',
        accelerator: 'CmdOrCtrl+S',
        click() {
          return;
        },
      },
    ],
  },
];

const darwinMenuItem: MenuItemConstructorOptions = {
  label: name,
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

const quitMenuItem: MenuItemConstructorOptions = {
  label: '끝내기',
  accelerator: 'Ctrl+W',
  click: function () {
    app.quit();
  },
};

export function setMainMenu() {
  const template = [...commonMenuItems];

  if (process.platform === 'darwin') {
    template.unshift(darwinMenuItem);
  } else {
    if (!(template[0].submenu instanceof Menu)) {
      template[0].submenu?.push(...[Separator, quitMenuItem]);
    }
  }
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}
