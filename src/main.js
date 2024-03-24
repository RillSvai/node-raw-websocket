import { createServer } from 'http';
import { router } from './router.js';
import { CONTENT_TYPE, CONTENT_TYPE_KEY, HTTP_STATUS_CODE } from './constants/http-headers.constants.js';
import { loadConfiguration } from './config.js';

const config = loadConfiguration('./envs/.env');

const httpServer = createServer((request, response) => {
  const requestUrl = request.url;
  if (requestUrl in router) {
    return router[requestUrl](request, response);
  }

  response.writeHead(HTTP_STATUS_CODE.NOT_FOUND, { [CONTENT_TYPE_KEY]: CONTENT_TYPE.PLAIN_TEXT });
  response.end('Handler for current route wasn`t found');
});

httpServer.listen(config.httpPort);
