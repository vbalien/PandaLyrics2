import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';
import https from 'https';
import { dialog } from 'electron';
import { context } from './context';

async function getSpicetifyConfigPath() {
  return new Promise<string>((resolve, reject) => {
    exec('spicetify -c', function (error, stdout) {
      if (error) {
        reject(Error(error.message));
      }
      const configFile = stdout.trim();
      resolve(path.dirname(configFile));
    });
  });
}

export async function checkExtension() {
  try {
    const configPath = await getSpicetifyConfigPath();
    const extensionPath = path.join(configPath, 'Extensions');
    if (fs.existsSync(path.join(extensionPath, 'pandaLyrics.js'))) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    return false;
  }
}

function downloadFile(url: string, filename: string) {
  return new Promise<void>((resolve, reject) => {
    const req = https.get(url, res => {
      const chunks: Buffer[] = [];

      if (res.statusCode == 302 && res.headers.location) {
        downloadFile(res.headers.location, filename).then(() => resolve());
      } else {
        res.on('data', data => {
          chunks.push(data);
        });

        res.on('end', () => {
          const buffer = Buffer.concat(chunks);
          const data = buffer.toString('utf8');
          try {
            fs.writeFileSync(filename, data);
          } catch (err) {
            fs.unlinkSync(filename);
            reject(err);
          }
          resolve();
        });
      }
    });
    req.on('error', err => {
      reject(err);
    });
  });
}

function execute(cmd: string) {
  return new Promise<void>((resolve, reject) => {
    exec(cmd, function (error) {
      if (error) {
        reject(Error(error.message));
      } else {
        resolve();
      }
    });
  });
}

export async function installExtension() {
  try {
    const configPath = await getSpicetifyConfigPath();
    const extensionPath = path.join(configPath, 'Extensions');
    const extensionFilename = path.join(extensionPath, 'pandaLyrics.js');

    await downloadFile(
      'https://github.com/vbalien/spicetify-extension-pandaLyrics/releases/latest/download/pandaLyrics.js',
      extensionFilename
    );
    await execute('spicetify config extensions pandaLyrics.js');
    await execute('spicetify apply');

    if (context.mainWindow) {
      await dialog.showMessageBox(context.mainWindow, {
        message: '설치되었습니다.',
      });
    }
  } catch (err) {
    if (err instanceof Error) {
      if (context.mainWindow) {
        await dialog.showMessageBox(context.mainWindow, {
          message: err.message,
        });
      }
    }
  }
}
