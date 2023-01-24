"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLyricById = exports.getLyricList = void 0;
const http_1 = __importDefault(require("http"));
const fast_xml_parser_1 = require("fast-xml-parser");
const sqlstring_1 = __importDefault(require("sqlstring"));
const ENC_DATA = '8456ec35caba5c981e705b0c5d76e4593e020ae5e3d469c75d1c6714b6b1244c0732f1f19cc32ee5123ef7de574fc8bc6d3b6bd38dd3c097f5a4a1aa1b438fea0e413baf8136d2d7d02bfcdcb2da4990df2f28675a3bd621f8234afa84fb4ee9caa8f853a5b06f884ea086fd3ed3b4c6e14f1efac5a4edbf6f6cb475445390b0';
async function alsongRequest(action, body) {
    const builder = new fast_xml_parser_1.XMLBuilder({});
    const xmlBody = builder.build({ [`ns1:${action}`]: body });
    const data = `<?xml version="1.0" encoding="UTF-8"?>
  <SOAP-ENV:Envelope
    xmlns:SOAP-ENV="http://www.w3.org/2003/05/soap-envelope"
    xmlns:SOAP-ENC="http://www.w3.org/2003/05/soap-encoding"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:xsd="http://www.w3.org/2001/XMLSchema"
    xmlns:ns1="ALSongWebServer"
    xmlns:ns2="ALSongWebServer/Service1Soap"
    xmlns:ns3="ALSongWebServer/Service1Soap12">
    <SOAP-ENV:Body>${xmlBody}</SOAP-ENV:Body>
  </SOAP-ENV:Envelope>`;
    const promise = new Promise((resolve, reject) => {
        const req = http_1.default.request({
            hostname: 'lyrics.alsong.co.kr',
            port: 80,
            path: '/alsongwebservice/service1.asmx',
            method: 'POST',
            headers: {
                'Content-Type': 'text/xml;charset=utf-8',
                'User-Agent': 'gSOAP/2.7',
                SOAPAction: `ALSongWebServer/${action}`,
            },
        }, res => {
            if (res.statusCode !== 200) {
                reject(res.statusMessage);
                return;
            }
            const chunks = [];
            res.on('data', data => {
                chunks.push(data);
            });
            res.on('end', () => {
                const buffer = Buffer.concat(chunks);
                const data = buffer.toString('utf8');
                const parser = new fast_xml_parser_1.XMLParser();
                const jsonObj = parser.parse(data);
                resolve({
                    result: jsonObj['soap:Envelope']['soap:Body'][`${action}Response`][`${action}Result`],
                    output: jsonObj['soap:Envelope']['soap:Body'][`${action}Response`]
                        .output,
                });
            });
        });
        req.on('error', err => {
            reject(err);
        });
        req.write(data);
        req.end();
    });
    return promise;
}
async function getLyricList({ title, artist, }) {
    const body = {
        'ns1:encData': ENC_DATA,
        'ns1:pageNo': 1,
    };
    title && (body['ns1:title'] = sqlstring_1.default.escape(title));
    artist && (body['ns1:artist'] = sqlstring_1.default.escape(artist));
    const json = await alsongRequest('GetResembleLyricList2', body);
    if (typeof json.result !== 'object' ||
        !(json.result['ST_SEARCHLYRIC_LIST'] instanceof Array)) {
        return [];
    }
    return json.result['ST_SEARCHLYRIC_LIST'];
}
exports.getLyricList = getLyricList;
async function getLyricById(lyricID) {
    const body = {
        'ns1:encData': ENC_DATA,
        'ns1:lyricID': lyricID,
    };
    const json = await alsongRequest('GetLyricByID2', body);
    const result = json.result;
    const output = json.output;
    if (result === false || output === undefined || typeof output !== 'object') {
        return null;
    }
    return output;
}
exports.getLyricById = getLyricById;
