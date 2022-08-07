import { App, BlockAction, Option } from '@slack/bolt';
import { toggleAdminStatus } from '../models/user/user.service';
import { userStore } from '../models/user/user.store';

export function toggleAdmin(app: App) {
  app.action<BlockAction>(
    /^admin-toggle/,
    async ({ ack, payload, body, client }) => {
      await ack();

      if (
        !('selected_options' in body.actions[0]) ||
        !('action_id' in body.actions[0])
      )
        return;

      const uid = body.actions[0].action_id.replace('admin-toggle-', '');
      const newAdminStatus =
        (body.actions[0]?.selected_options as Option[]).length > 0;

      if (uid) {
        await toggleAdminStatus(uid, newAdminStatus);
      }
    }
  );
}
