import { App } from '@slack/bolt';
import { syncSlackUsers } from '../middleware/sync-users';
import { appHomeOpened } from './app-home-opened';

export function registerEvents(app: App) {
  // register middleware to keep users synced with db
  syncSlackUsers(app);

  const events = [appHomeOpened];

  events.forEach(event => event(app));
}
