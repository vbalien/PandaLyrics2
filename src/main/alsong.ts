import http from 'http';
import { XMLParser, XMLBuilder } from 'fast-xml-parser';

export type LyricData = {
  lyricID: number;
  title: string;
  artist: string;
  album: string;
};

export type LyricDetailData = LyricData & {
  lyric: string;
  registerName: string;
  registerMail: string;
  registerHomeURL: string;
  registerPhone: string;
  registerComment: string;
  modifierName: string;
  modifierMail: string;
  modifierHomeURL: string;
  modifierPhone: string;
  modifierComment: string;
};

type JsonValue = string | boolean | number | Json;
type Json = { [k: string]: JsonValue };

async function alsongRequest(action: string, body: Json) {
  const builder = new XMLBuilder({});
  const xmlBody = builder.build({ [`ns1:${action}`]: body });
  const data = `<?xml version="1.0" encoding="UTF-8"?>
  <SOAP-ENV:Envelope xmlns:SOAP-ENV="http://www.w3.org/2003/05/soap-envelope" xmlns:SOAP-ENC="http://www.w3.org/2003/05/soap-encoding" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:ns2="ALSongWebServer/Service1Soap" xmlns:ns1="ALSongWebServer" xmlns:ns3="ALSongWebServer/Service1Soap12">
    <SOAP-ENV:Body>${xmlBody}</SOAP-ENV:Body>
  </SOAP-ENV:Envelope>`;
  const promise = new Promise<{ result: JsonValue; output?: JsonValue }>(
    (resolve, reject) => {
      const req = http.request(
        {
          hostname: 'lyrics.alsong.co.kr',
          port: 80,
          path: '/alsongwebservice/service1.asmx',
          method: 'POST',
          headers: {
            'Content-Type': 'text/xml;charset=utf-8',
            'User-Agent': 'gSOAP/2.7',
            SOAPAction: `ALSongWebServer/${action}`,
          },
        },
        res => {
          const chunks: Buffer[] = [];
          res.on('data', data => {
            chunks.push(data);
          });

          res.on('end', () => {
            const buffer = Buffer.concat(chunks);
            const data = buffer.toString('utf8');
            const parser = new XMLParser();
            const jsonObj = parser.parse(data);
            resolve({
              result:
                jsonObj['soap:Envelope']['soap:Body'][`${action}Response`][
                  `${action}Result`
                ],
              output:
                jsonObj['soap:Envelope']['soap:Body'][`${action}Response`]
                  .output,
            });
          });
        }
      );
      req.on('error', err => {
        reject(err);
      });
      req.write(data);
      req.end();
    }
  );
  return promise;
}

export async function getLyricList({
  title,
  artist,
}: {
  title?: string;
  artist?: string;
}): Promise<LyricData[]> {
  const body: Json = {
    'ns1:encData':
      '8456ec35caba5c981e705b0c5d76e4593e020ae5e3d469c75d1c6714b6b1244c0732f1f19cc32ee5123ef7de574fc8bc6d3b6bd38dd3c097f5a4a1aa1b438fea0e413baf8136d2d7d02bfcdcb2da4990df2f28675a3bd621f8234afa84fb4ee9caa8f853a5b06f884ea086fd3ed3b4c6e14f1efac5a4edbf6f6cb475445390b0',
    'ns1:pageNo': 1,
  };
  title && (body['ns1:title'] = title);
  artist && (body['ns1:artist'] = artist);
  const json = await alsongRequest('GetResembleLyricList2', body);
  if (
    typeof json.result !== 'object' ||
    !(json.result['ST_SEARCHLYRIC_LIST'] instanceof Array)
  ) {
    return [];
  }
  return json.result['ST_SEARCHLYRIC_LIST'] as unknown as LyricData[];
}

export async function getLyricById(
  lyricID: number
): Promise<LyricDetailData | null> {
  const body: Json = {
    'ns1:encData':
      '8456ec35caba5c981e705b0c5d76e4593e020ae5e3d469c75d1c6714b6b1244c0732f1f19cc32ee5123ef7de574fc8bc6d3b6bd38dd3c097f5a4a1aa1b438fea0e413baf8136d2d7d02bfcdcb2da4990df2f28675a3bd621f8234afa84fb4ee9caa8f853a5b06f884ea086fd3ed3b4c6e14f1efac5a4edbf6f6cb475445390b0',
    'ns1:lyricID': lyricID,
  };
  const json = await alsongRequest('GetLyricByID2', body);
  const result = json.result;
  const output = json.output;
  if (result === false || output === undefined || typeof output !== 'object') {
    return null;
  }
  return output as unknown as LyricDetailData;
}
