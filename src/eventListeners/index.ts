import { App } from '@slack/bolt';
import { appHomeOpened } from './app-home-opened';

export function registerEvents(app: App) {
  const events = [appHomeOpened];

  events.forEach(event => event(app));
}
