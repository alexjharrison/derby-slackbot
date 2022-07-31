import { App } from '@slack/bolt';
import { initLogger } from '../middleware/logger';
import { syncSlackUsers } from '../middleware/sync-users';
import { appHomeOpened } from './app-home-opened';
import { deleteEvent } from './delete-event';
import { openAdminModal } from './open-admin-modal';
import { openEventModal } from './open-event-modal';
import { handleRSVPResponse } from './rsvp-response';
import { toggleAdmin } from './toggle-admin';
import { upsertEvent } from './upsert-event';

export function registerEvents(app: App) {
  // register middleware to keep users synced with db

  const listeners = [
    initLogger,
    syncSlackUsers,
    appHomeOpened,
    handleRSVPResponse,
    openAdminModal,
    openEventModal,
    deleteEvent,
    upsertEvent,
    toggleAdmin,
  ];

  listeners.forEach(event => event(app));
}
