import { nativeImage, Tray } from 'electron';
import path from 'path';
import MainWindow from './main-window';
import { TYPES } from './types';
import { Container } from 'inversify';
import getDecorators from 'inversify-inject-decorators';

const container = new Container();
const { lazyInject } = getDecorators(container);

import TrayMenu from './tray-menu';

container
  .bind<MainWindow>(TYPES.MainWindow)
  .toDynamicValue(context => {
    const trayMenu = context.container.get<TrayMenu>(TYPES.TrayMenu);
    trayMenu.apply();
    return new MainWindow(trayMenu);
  })
  .inSingletonScope();
container.bind<TrayMenu>(TYPES.TrayMenu).to(TrayMenu).inSingletonScope();
container
  .bind<Tray>(TYPES.Tray)
  .toDynamicValue((context): Tray => {
    const iconPath = path.join(__dirname, '../../assets/Icon-App-20x20.png');
    const icon = nativeImage.createFromPath(iconPath);
    const tray = new Tray(icon);
    const trayMenu = context.container.get<TrayMenu>(TYPES.TrayMenu);

    tray.setToolTip('PandaLyrics');
    tray.on('double-click', () => {
      trayMenu.menu?.getMenuItemById('appVisible')?.click();
    });
    return tray;
  })
  .inSingletonScope();

export { container, lazyInject };
