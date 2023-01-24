"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.installExtension = exports.checkExtension = void 0;
const child_process_1 = require("child_process");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const https_1 = __importDefault(require("https"));
const electron_1 = require("electron");
const context_1 = require("./context");
async function getSpicetifyConfigPath() {
    return new Promise((resolve, reject) => {
        (0, child_process_1.exec)('spicetify -c', function (error, stdout) {
            if (error) {
                reject(Error(error.message));
            }
            const configFile = stdout.trim();
            resolve(path_1.default.dirname(configFile));
        });
    });
}
async function checkExtension() {
    try {
        const configPath = await getSpicetifyConfigPath();
        const extensionPath = path_1.default.join(configPath, 'Extensions');
        if (fs_1.default.existsSync(path_1.default.join(extensionPath, 'pandaLyrics.js'))) {
            return true;
        }
        else {
            return false;
        }
    }
    catch (err) {
        return false;
    }
}
exports.checkExtension = checkExtension;
function downloadFile(url, filename) {
    return new Promise((resolve, reject) => {
        const req = https_1.default.get(url, res => {
            const chunks = [];
            if (res.statusCode == 302 && res.headers.location) {
                downloadFile(res.headers.location, filename).then(() => resolve());
            }
            else {
                res.on('data', data => {
                    chunks.push(data);
                });
                res.on('end', () => {
                    const buffer = Buffer.concat(chunks);
                    const data = buffer.toString('utf8');
                    try {
                        fs_1.default.writeFileSync(filename, data);
                    }
                    catch (err) {
                        fs_1.default.unlinkSync(filename);
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
function execute(cmd) {
    return new Promise((resolve, reject) => {
        (0, child_process_1.exec)(cmd, function (error, stdout) {
            if (error) {
                reject(Error(error.message));
            }
            else {
                // eslint-disable-next-line no-control-regex
                resolve(stdout.replace(/\u001b[^m]*?m/g, ''));
            }
        });
    });
}
async function installExtension() {
    try {
        const configPath = await getSpicetifyConfigPath();
        const extensionPath = path_1.default.join(configPath, 'Extensions');
        const extensionFilename = path_1.default.join(extensionPath, 'pandaLyrics.js');
        await downloadFile('https://github.com/vbalien/spicetify-extension-pandaLyrics/releases/latest/download/pandaLyrics.js', extensionFilename);
        await execute('spicetify config extensions pandaLyrics.js');
        const out = await execute('spicetify apply');
        if (!/(?:^|\n)success/.test(out)) {
            throw Error('설치하는데 실패하였습니다.\n' + out);
        }
        if (context_1.context.mainWindow) {
            await electron_1.dialog.showMessageBox(context_1.context.mainWindow, {
                message: '설치되었습니다.',
            });
        }
    }
    catch (err) {
        if (err instanceof Error) {
            if (context_1.context.mainWindow) {
                await electron_1.dialog.showMessageBox(context_1.context.mainWindow, {
                    message: err.message,
                });
            }
        }
    }
}
exports.installExtension = installExtension;
