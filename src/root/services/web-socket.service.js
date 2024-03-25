import * as crypto from 'crypto';
import { SEC_WEBSOCKET_ACCEPT_HEADER, SEC_WEBSOCKET_KEY_HEADER } from '../../constants/http-headers.constants.js';
import { STATIC_CLASS } from '../../constants/errors.constants.js';
import { FIRST_BIT } from '../../constants/binary.contants.js';
import { LENGTH_INDICATOR_7BITS, MASK_KEY_BYTES_LENGTH } from '../../constants/web-socket.constants.js';

export class WebSocketService {
  constructor() {
    throw new Error(STATIC_CLASS);
  }

  static handleWebSocketUpgrade(request, socket, head) {
    const secWebSockerKey = request.headers[SEC_WEBSOCKET_KEY_HEADER.toLowerCase()];
    const secWebSockerAccept = this.#generateAcceptValue(secWebSockerKey);
    const responseHeaders = this.#generateUpgradeHeaders(secWebSockerAccept);

    socket.write(responseHeaders);
    socket.on('readable', () => this.#onSocketReadable(socket));
  }

  static #generateUpgradeHeaders(secWebSocketAccept) {
    const responseHeaders = [
      'HTTP/1.1 101 Switching Protocols',
      'Upgrade: websocket',
      'Connection: Upgrade',
      `${SEC_WEBSOCKET_ACCEPT_HEADER}: ${secWebSocketAccept}`,
      '\r\n',
    ].join('\r\n');

    return responseHeaders;
  }

  static #onSocketReadable(socket) {
    socket.read(1);

    const [byte2] = socket.read(1);

    const payloadLengthIndicator = byte2 - FIRST_BIT;
    let payloadLength = 0;

    if (payloadLengthIndicator < LENGTH_INDICATOR_7BITS) {
      payloadLength = payloadLengthIndicator;
    }

    const maskKey = socket.read(MASK_KEY_BYTES_LENGTH);
    const encodedPayload = socket.read(payloadLength);
  }

  static #generateAcceptValue(secWebSockerKey) {
    const magicString = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11';
    const hash = crypto.createHash('sha1');

    hash.update(secWebSockerKey + magicString);
    return hash.digest('base64');
  }
}
