import { app, Menu, MenuItemConstructorOptions } from 'electron';
import { createSettingsWindow, windowContext } from './window';

const name = app.name;

const Separator: MenuItemConstructorOptions = {
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

const quitMenuItem: MenuItemConstructorOptions = {
  label: '끝내기',
  accelerator: 'Ctrl+W',
  click: function () {
    app.quit();
  },
};

export const trayMenu = Menu.buildFromTemplate([
  { label: '표시', type: 'checkbox', id: 'appVisible' },
  Separator,
  { label: '가사 선택', type: 'submenu', id: 'lyrics', submenu: [] },
  Separator,
  { label: '위치 이동', type: 'checkbox', id: 'moveMode' },
  {
    label: '환경설정',
    type: 'normal',
    id: 'settings',
    click: () => {
      if (windowContext.settingsWindow === null) {
        windowContext.settingsWindow = createSettingsWindow();
        windowContext.settingsWindow.on('closed', () => {
          windowContext.settingsWindow = null;
        });
      } else {
        windowContext.settingsWindow.show();
      }
    },
  },
  Separator,
  { label: '종료', type: 'normal', id: 'exit', click: () => app.quit() },
]);

export function setApplicationMenu() {
  const template = [];

  if (process.platform === 'darwin') {
    template.unshift(darwinMenuItem);
  } else {
    if (template[0].submenu instanceof Array) {
      template[0].submenu?.push(...[Separator, quitMenuItem]);
    }
  }
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}
