import { App } from '@slack/bolt';
import { initLogger } from '../middleware/logger';
import { syncSlackUsers } from '../middleware/sync-users';
import { appHomeOpened } from './app-home-opened';
import { openAdminModal } from './open-admin-modal';
import { openEventRsvpList } from './open-event-rsvp-list';
import { handleRSVPResponse } from './rsvp-response';
import { toggleAdmin } from './toggle-admin';

export function registerEvents(app: App) {
  // register middleware to keep users synced with db

  const listeners = [
    initLogger,
    syncSlackUsers,
    appHomeOpened,
    openEventRsvpList,
    handleRSVPResponse,
    openAdminModal,
    toggleAdmin,
  ];

  listeners.forEach(event => event(app));
}
