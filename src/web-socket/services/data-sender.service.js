import { STATIC_CLASS } from '../../common/constants/errors.constants.js';
import {
  LENGTH_INDICATOR_16BIT,
  LENGTH_INDICATOR_64BIT,
  LENGTH_INDICATOR_7BITS,
  MAX_LENGTH_16BIT,
  MAX_LENGTH_64BIT,
} from '../web-socket.constants.js';

export class DataSenderService {
  static connectedClients = new Set();
  constructor() {
    throw new Error(STATIC_CLASS);
  }

  static #sendTextMessage(message, socket) {
    const dataFrameBuffer = this.#prepareTextMessage(message);
    socket.write(dataFrameBuffer);
  }

  static broadcastMessage(message) {
    for (const client of this.connectedClients) {
      this.#sendTextMessage(message, client);
    }
  }

  static #prepareTextMessage(message) {
    if (typeof message === 'object') {
      message = JSON.stringify(message);
    }

    const dataBuffer = Buffer.from(message);
    const dataBufferLength = dataBuffer.length;
    const firstByte = 0x80 | 0x01;

    let offset;
    let dataFrameBuffer;
    if (dataBufferLength <= LENGTH_INDICATOR_7BITS) {
      offset = 2;

      dataFrameBuffer = this.#prepareDataFrameBuffer(offset, firstByte, dataBufferLength, dataBufferLength);
      dataBuffer.copy(dataFrameBuffer, offset);

      return dataFrameBuffer;
    } else if (dataBufferLength <= MAX_LENGTH_16BIT) {
      offset = 4;

      dataFrameBuffer = this.#prepareDataFrameBuffer(offset, firstByte, LENGTH_INDICATOR_16BIT, dataBufferLength);
      dataFrameBuffer.writeUInt16BE(dataBufferLength, 2);
      dataBuffer.copy(dataFrameBuffer, offset);

      return dataFrameBuffer;
    } else if (dataBufferLength <= MAX_LENGTH_64BIT) {
      offset = 10;

      dataFrameBuffer = this.#prepareDataFrameBuffer(offset, firstByte, LENGTH_INDICATOR_64BIT, dataBufferLength);
      dataBuffer.writeUInt32BE(0, 2);
      dataFrameBuffer.writeUInt32BE(dataBufferLength, 2);
      dataBuffer.copy(dataFrameBuffer, offset);

      return dataFrameBuffer;
    }

    throw new Error('Message size exceeds maximum safe integer value in JavaScript.');
  }

  static #prepareDataFrameBuffer(offset, firstByte, lengthIndicator, dataBufferLength) {
    const buffer = Buffer.alloc(offset + dataBufferLength);
    buffer[0] = firstByte;
    buffer[1] = lengthIndicator;
    return buffer;
  }
}
