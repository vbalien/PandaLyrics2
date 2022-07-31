import { BrowserWindow, screen } from 'electron';
import path from 'path';

const isDevelopment = process.env.NODE_ENV !== 'production';

export const windowContext: {
  mainWindow: BrowserWindow | null;
  settingsWindow: BrowserWindow | null;
} = { mainWindow: null, settingsWindow: null };

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
      nodeIntegration: true,
      contextIsolation: false,
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
    windowContext.mainWindow = null;
  });

  window.webContents.on('did-finish-load', () => {
    if (!windowContext.mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    windowContext.mainWindow.show();
    windowContext.mainWindow.focus();
  });

  window.webContents.on('devtools-opened', () => {
    windowContext.mainWindow.focus();
    setImmediate(() => {
      windowContext.mainWindow.focus();
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
