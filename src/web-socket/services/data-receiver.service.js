import { STATIC_CLASS } from '../../common/constants/errors.constants.js';
import { FIRST_BIT } from '../../common/constants/binary.contants.js';
import { LENGTH_INDICATOR_7BITS, MASK_KEY_BYTES_LENGTH } from '../web-socket.constants.js';
import { ConvertorUtil } from '../../common/utils/convertor.util.js';

export class DataReceiverService {
  constructor() {
    throw new Error(STATIC_CLASS);
  }

  static onSocketReadable(socket) {
    socket.read(1);

    const [byte2] = socket.read(1);

    const payloadLengthIndicator = byte2 - FIRST_BIT;
    let payloadLength = 0;

    if (payloadLengthIndicator < LENGTH_INDICATOR_7BITS) {
      payloadLength = payloadLengthIndicator;
    }

    const maskKey = socket.read(MASK_KEY_BYTES_LENGTH);
    const encodedPayload = socket.read(payloadLength);
    const decodedPayload = this.#unmaskPayload(encodedPayload, maskKey);
    const received = Buffer.from(decodedPayload).toString('utf-8');
    const data = JSON.parse(received);

    console.log(Buffer.from(maskKey).toString('utf-8'));
    console.log(data);
  }

  static #unmaskPayload(payload, maskKey) {
    return Uint8Array.from(payload, (element, i) => {
      const maskByte = maskKey[i % MASK_KEY_BYTES_LENGTH];
      const result = element ^ maskByte;

      const payloadBinary = ConvertorUtil.byteToBinaryString(element);
      const maskBinary = ConvertorUtil.byteToBinaryString(maskByte);
      const resultBinary = ConvertorUtil.byteToBinaryString(result);
      const resultChar = ConvertorUtil.binaryToChar(resultBinary);
      console.log(`${payloadBinary} ^ ${maskBinary} = ${resultBinary} decoded: ${resultChar}`);

      return result;
    });
  }
}
