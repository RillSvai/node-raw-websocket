import { createServer } from 'http';
import { WebSocketService } from './web-socket/services/web-socket.service.js';
import { RootService } from './application.service.js';
import { ConfigurationService } from './common/configuration/configuration.service.js';

const config = ConfigurationService.loadConfiguration('./envs/.env');

const httpServer = createServer(RootService.handleAnyRequest);

httpServer.listen(config.httpPort);

httpServer.on('upgrade', WebSocketService.handleWebSocketUpgrade.bind(WebSocketService));

[('uncaughtException', 'unhandledRejection')].forEach((event) => {
  process.on(event, (error) => {
    console.error(`Event: ${event}\nMessage: ${error.stack || error}`);
  });
});
