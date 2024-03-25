import { CONTENT_TYPE, CONTENT_TYPE_HEADER, HTTP_STATUS_CODE } from './common/constants/http-headers.constants.js';
import * as fs from 'fs';
import * as path from 'path';
import { STATIC_CLASS } from './common/constants/errors.constants.js';

export class RootController {
  constructor() {
    throw new Error(STATIC_CLASS);
  }

  static getTestMessage(request, response) {
    response.writeHead(HTTP_STATUS_CODE.OK, { 'Content-Type': 'text/plain' });
    response.end('Success');
  }

  static async getFavicon(request, response) {
    try {
      const cwd = process.cwd();
      const data = await fs.promises.readFile(path.join(cwd, 'public', 'favicon.ico'), 'utf-8');

      response.writeHead(HTTP_STATUS_CODE.OK, { [CONTENT_TYPE_HEADER]: CONTENT_TYPE.ICON });
      response.end(data);
    } catch (error) {
      console.log(error);
      response.writeHead(HTTP_STATUS_CODE.NOT_FOUND);
      response.end('Favicon not found');
    }
  }
}
