"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupWebsocket = void 0;
const ws_1 = require("ws");
function setupWebsocket(options) {
    const wss = new ws_1.WebSocketServer({ port: 8999 });
    wss.on('connection', ws => {
        ws.on('message', data => {
            const msg = JSON.parse(data.toString('utf8'));
            switch (msg.type) {
                case 'songchange':
                    options.changeSongEvent(msg);
                    break;
                case 'statechange':
                    options.changeStateEvent(msg);
                    break;
                case 'tick':
                    options.tickEvent(msg);
                    break;
            }
        });
        ws.on('close', () => {
            options.closeEvent();
        });
    });
    return wss;
}
exports.setupWebsocket = setupWebsocket;
