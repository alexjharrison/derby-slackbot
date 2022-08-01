import { App } from '@slack/bolt';
import { log } from '../utils/log';
import { adminListView } from '../views/modals/admin-list-modal';
import { modalStore } from '../views/modals/modal-store';

export function openAdminModal(app: App) {
  app.action(
    'open_edit_admins_modal',
    async ({ ack, body, payload, client }) => {
      await ack();

      if (
        payload.type !== 'button' ||
        !('action_ts' in payload) ||
        !('trigger_id' in body)
      )
        return;

      const res = await client.views.open({
        trigger_id: body.trigger_id,
        view: adminListView(body.user.id),
      });

      modalStore.latestModalId = res.view?.id || '';
    }
  );
}
