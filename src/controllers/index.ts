import { App } from '@slack/bolt';
import { deleteExpiredDms } from '../middleware/delete-expired-dms';
import { initLogger } from '../middleware/logger';
import { syncSlackUsers } from '../middleware/sync-users';
import { appHomeOpened } from './app-home-opened';
import { deleteEvent } from './delete-event';
import { openAdminModal } from './open-admin-modal';
import { openEventDetailModal } from './open-event-detail-modal';
import { openEventEditModal } from './open-event-edit-modal';
import { handleRSVPResponse } from './rsvp-response';
import { toggleAdmin } from './toggle-admin';
import { upsertEvent } from './upsert-event';
import { selectEventFilter } from './select-event-filter';

export function registerEvents(app: App) {
  // register middleware to keep users synced with db

  const listeners = [
    initLogger,
    syncSlackUsers,
    deleteExpiredDms,
    appHomeOpened,
    handleRSVPResponse,
    openAdminModal,
    openEventEditModal,
    openEventDetailModal,
    deleteEvent,
    upsertEvent,
    toggleAdmin,
    selectEventFilter
  ];

  listeners.forEach(event => event(app));
}
