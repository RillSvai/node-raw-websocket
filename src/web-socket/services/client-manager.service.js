import { STATIC_CLASS } from '../../common/constants/errors.constants.js';

export class ClientManagerService {
  static #rooms = new Map();

  constructor() {
    throw new Error(STATIC_CLASS);
  }

  static addClientToRoom(roomName, client) {
    if (!this.#rooms.has(roomName)) {
      this.#rooms.set(roomName, new Set());
    }
    const clients = this.#rooms.get(roomName);
    clients.add(client);
  }

  static getClientsFromRoom(roomName) {
    return this.#rooms.get(roomName);
  }
}
