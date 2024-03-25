import { STATIC_CLASS } from './common/constants/errors.constants.js';
import { CONTENT_TYPE, CONTENT_TYPE_HEADER, HTTP_STATUS_CODE } from './common/constants/http-headers.constants.js';
import { router } from './router.js';

export class RootService {
  constructor() {
    throw new Error(STATIC_CLASS);
  }

  static handleAnyRequest(request, response) {
    const requestUrl = request.url;
    if (requestUrl in router) {
      return router[requestUrl](request, response);
    }

    response.writeHead(HTTP_STATUS_CODE.NOT_FOUND, { [CONTENT_TYPE_HEADER]: CONTENT_TYPE.PLAIN_TEXT });
    response.end('Handler for current route wasn`t found');
  }
}
