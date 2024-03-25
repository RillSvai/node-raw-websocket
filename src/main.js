import { createServer } from 'http';
import { loadConfiguration } from './config.js';
import { WebSocketService } from './root/services/web-socket.service.js';
import { RootService } from './root/services/root.service.js';

const config = loadConfiguration('./envs/.env');

const httpServer = createServer(RootService.handleAnyRequest);

httpServer.listen(config.httpPort);

httpServer.on('upgrade', WebSocketService.handleWebSocketUpgrade.bind(WebSocketService));

[('uncaughtException', 'unhandledRejection')].forEach((event) => {
  process.on(event, (error) => {
    console.error(`Event: ${event}\nMessage: ${error.stack || error}`);
  });
});
