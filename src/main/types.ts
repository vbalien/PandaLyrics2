import { Tray } from 'electron';
import TrayMenu from '../main/tray-menu';
import MainWindow from './main-window';

export interface AppContext {
  mainWindow: MainWindow | null;
  tray: Tray | null;
  trayMenu: TrayMenu | null;
}
