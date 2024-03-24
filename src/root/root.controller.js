import { CONTENT_TYPE, CONTENT_TYPE_KEY, HTTP_STATUS_CODE } from '../constants/http-headers.constants.js';
import * as fs from 'fs';
import * as path from 'path';

export class RootController {
  constructor() {
    throw new Error('Cannot instantiate this class.');
  }

  static getTestMessage(request, response) {
    response.writeHead(HTTP_STATUS_CODE.OK, { 'Content-Type': 'text/plain' });
    response.end('Success');
  }

  static async getFavicon(request, response) {
    try {
      const cwd = process.cwd();
      const data = await fs.promises.readFile(path.join(cwd, 'public', 'favicon.ico'), 'utf-8');

      response.writeHead(HTTP_STATUS_CODE.OK, { [CONTENT_TYPE_KEY]: CONTENT_TYPE.ICON });
      response.end(data);
    } catch (error) {
      console.log(error);
      response.writeHead(HTTP_STATUS_CODE.NOT_FOUND);
      response.end('Favicon not found');
    }
  }
}
