import { App } from '@slack/bolt';
import { initLogger } from '../middleware/logger';
import { syncSlackUsers } from '../middleware/sync-users';
import { appHomeOpened } from './app-home-opened';

export function registerEvents(app: App) {
  // register middleware to keep users synced with db

  const listeners = [initLogger, syncSlackUsers, appHomeOpened];

  listeners.forEach(event => event(app));
}
