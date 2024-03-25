import { SEC_WEBSOCKET_KEY_HEADER } from '../../common/constants/http-headers.constants.js';
import { STATIC_CLASS } from '../../common/constants/errors.constants.js';
import { DataReceiverService } from './data-receiver.service.js';
import { HandshakeService } from './handshake.service.js';

export class WebSocketService {
  constructor() {
    throw new Error(STATIC_CLASS);
  }

  static handleWebSocketUpgrade(request, socket, head) {
    const secWebSockerKey = request.headers[SEC_WEBSOCKET_KEY_HEADER.toLowerCase()];

    const secWebSockerAccept = HandshakeService.generateAcceptValue(secWebSockerKey);
    const responseHeaders = HandshakeService.generateUpgradeHeaders(secWebSockerAccept);
    socket.write(responseHeaders);

    socket.on('readable', () => DataReceiverService.onSocketReadable(socket));
  }
}
