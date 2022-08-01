import { BrowserWindow, screen } from 'electron';
import { context } from './';
import path from 'path';

const isDevelopment = process.env.NODE_ENV !== 'production';

export function createMainWindow() {
  const primaryDisplay = screen.getPrimaryDisplay();
  const window = new BrowserWindow({
    frame: false,
    transparent: true,
    minimizable: false,
    maximizable: false,
    resizable: false,
    show: false,
    hasShadow: false,
    skipTaskbar: true,
    webPreferences: {
      preload: isDevelopment
        ? path.join(__dirname, '../../dist/preload.js')
        : path.join(__dirname, 'preload.js'),
    },
    useContentSize: true,
    width: 600,
    height: 150,
    x: primaryDisplay.size.width - 600 - 30,
    y: primaryDisplay.size.height - 150 - 30,
  });

  window.setAlwaysOnTop(true, 'screen-saver');
  window.setVisibleOnAllWorkspaces(true);
  window.setIgnoreMouseEvents(true);
  window.setMenu(null);
  window.setMenuBarVisibility(false);

  if (isDevelopment) {
    window.webContents.openDevTools();
  }

  if (isDevelopment) {
    window.loadURL(`http://localhost:8080/#main`);
  } else {
    window.loadURL(
      `file://${path.join(__dirname, '../renderer/index.html#main')}`
    );
  }

  window.on('closed', () => {
    context.mainWindow = null;
  });

  window.webContents.on('did-finish-load', () => {
    if (!context.mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    context.mainWindow.show();
    context.mainWindow.focus();
  });

  window.webContents.on('devtools-opened', () => {
    if (!context.mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    context.mainWindow.focus();
    setImmediate(() => {
      if (!context.mainWindow) {
        throw new Error('"mainWindow" is not defined');
      }
      context.mainWindow.focus();
    });
  });

  return window;
}

export function createSettingsWindow() {
  const window = new BrowserWindow({
    minimizable: false,
    maximizable: false,
    resizable: false,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    width: 400,
    height: 600,
  });

  window.setMenu(null);
  window.setMenuBarVisibility(false);

  if (isDevelopment) {
    window.webContents.openDevTools();
  }

  if (isDevelopment) {
    window.loadURL(`http://localhost:8080/#settings`);
  } else {
    window.loadURL(
      `file://${path.join(__dirname, '../renderer/index.html#settings')}`
    );
  }

  window.webContents.on('did-finish-load', () => {
    if (!window) {
      throw new Error('"mainWindow" is not defined');
    }
    window.show();
    window.focus();
  });

  window.webContents.on('devtools-opened', () => {
    window.focus();
    setImmediate(() => {
      window.focus();
    });
  });

  return window;
}
