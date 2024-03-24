import { RootController } from './root.controller.js';

export const rootRouter = {
  '/': RootController.getTestMessage,
  '/favicon.ico': RootController.getFavicon,
};
