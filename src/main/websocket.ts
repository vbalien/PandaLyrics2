import { WebSocketServer } from 'ws';

type MessageBase<T, D> = {
  type: T;
  data: D;
};
export type ChangeSongMessage = MessageBase<
  'songchange',
  {
    title: string;
    artist: string;
    songID: string;
    is_paused: boolean;
  }
>;
export type ChangeStateMessage = MessageBase<
  'statechange',
  {
    is_paused: boolean;
  }
>;
export type TickMessage = MessageBase<
  'tick',
  {
    time: number;
  }
>;
export type Message = ChangeSongMessage | ChangeStateMessage | TickMessage;

export function setupWebsocket(options: {
  changeSongEvent: (msg: ChangeSongMessage) => void;
  tickEvent: (msg: TickMessage) => void;
  changeStateEvent: (msg: ChangeStateMessage) => void;
  closeEvent: () => void;
}) {
  const wss = new WebSocketServer({ port: 8999 });
  wss.on('connection', ws => {
    ws.on('message', data => {
      const msg = JSON.parse(data.toString('utf8')) as Message;
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
