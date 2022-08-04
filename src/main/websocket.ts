import { WebSocketServer } from 'ws';

type MessageBase<T, D> = {
  type: T;
  data: D;
};
export type SongChangeMessage = MessageBase<
  'songchange',
  {
    title: string;
    artist: string;
    songID: string;
  }
>;
export type TickMessage = MessageBase<
  'tick',
  {
    time: number;
  }
>;
export type Message = SongChangeMessage | TickMessage;

export function setupWebsocket(options: {
  songChangeEvent: (msg: SongChangeMessage) => void;
  tickEvent: (msg: TickMessage) => void;
  closeEvent: () => void;
}) {
  const wss = new WebSocketServer({ port: 8999 });
  wss.on('connection', ws => {
    ws.on('message', data => {
      const msg = JSON.parse(data.toString('utf8')) as Message;
      switch (msg.type) {
        case 'songchange':
          options.songChangeEvent(msg);
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
