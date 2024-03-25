import { STATIC_CLASS } from '../../common/constants/errors.constants.js';
import { LENGTH_INDICATOR_7BITS, MASK_KEY_BYTES_LENGTH } from '../web-socket.constants.js';
import { ConvertorUtil } from '../../common/utils/convertor.util.js';
import { DataSenderService } from './data-sender.service.js';

export class DataReceiverService {
  constructor() {
    throw new Error(STATIC_CLASS);
  }

  static onSocketReadable(socket) {
    const [byte1] = socket.read(1);
    const opcode = byte1 & 0x0f;

    switch (opcode) {
      case 0x1: // Text frame
        this.#handleTextFrame(socket);
        break;
      case 0x2: // Binary frame
        break;
      case 0x8: // Connection close frame
        break;
      case 0x9: // Ping frame
        break;
      case 0xa: // Pong frame
        break;
      default:
        break;
    }
  }

  static #handleTextFrame(socket) {
    const [byte2] = socket.read(1);

    const payloadLengthIndicator = byte2 - 0x80;
    let payloadLength = 0;

    if (payloadLengthIndicator < LENGTH_INDICATOR_7BITS) {
      payloadLength = payloadLengthIndicator;
    }

    const maskKey = socket.read(MASK_KEY_BYTES_LENGTH);
    const encodedPayload = socket.read(payloadLength);
    const dataUtf8 = this.#unmaskPayload(encodedPayload, maskKey);
    let data;
    try {
      data = JSON.parse(dataUtf8);
    } catch (error) {
      data = dataUtf8;
    }

    const message = {
      data,
      at: new Date().toISOString(),
    };

    console.log(message);

    DataSenderService.sendTextMessage(message, socket);
  }

  static #unmaskPayload(payload, maskKey) {
    const unmaskedPayload = Uint8Array.from(payload, (element, i) => {
      const maskByte = maskKey[i % MASK_KEY_BYTES_LENGTH];
      const result = element ^ maskByte;

      const payloadBinary = ConvertorUtil.byteToBinaryString(element);
      const maskBinary = ConvertorUtil.byteToBinaryString(maskByte);
      const resultBinary = ConvertorUtil.byteToBinaryString(result);
      const resultChar = ConvertorUtil.binaryToChar(resultBinary);
      console.log(`${payloadBinary} ^ ${maskBinary} = ${resultBinary} decoded: ${resultChar}`);

      return result;
    });

    return Buffer.from(unmaskedPayload).toString('utf-8');
  }
}
