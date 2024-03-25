import { STATIC_CLASS } from '../../common/constants/errors.constants.js';
import { SEC_WEBSOCKET_ACCEPT_HEADER } from '../../common/constants/http-headers.constants.js';
import * as crypto from 'crypto';

export class HandshakeService {
  constructor() {
    throw new Error(STATIC_CLASS);
  }

  static generateUpgradeHeaders(secWebSocketAccept) {
    const responseHeaders = [
      'HTTP/1.1 101 Switching Protocols',
      'Upgrade: websocket',
      'Connection: Upgrade',
      `${SEC_WEBSOCKET_ACCEPT_HEADER}: ${secWebSocketAccept}`,
      '\r\n',
    ].join('\r\n');

    return responseHeaders;
  }

  static generateAcceptValue(secWebSockerKey) {
    const magicString = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11';
    const hash = crypto.createHash('sha1');

    hash.update(secWebSockerKey + magicString);
    return hash.digest('base64');
  }
}
