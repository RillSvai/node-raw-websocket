import { RootController } from './application.controller.js';

export const rootRouter = {
  '/': RootController.getTestMessage,
  '/favicon.ico': RootController.getFavicon,
};
