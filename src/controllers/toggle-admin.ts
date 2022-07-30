import { App, Option } from '@slack/bolt';
import { toggleAdminStatus } from '../models/user/user.service';
import { userStore } from '../models/user/user.store';

export function toggleAdmin(app: App) {
  app.action(/^admin-toggle/, async ({ ack, payload, body, client }) => {
    if (
      !('actions' in body) ||
      !('selected_options' in body.actions[0]) ||
      !('action_id' in body.actions[0])
    ) {
      await ack();
      return;
    }

    const uids = body.actions[0].selected_options?.map(opt => opt.value || '');
    console.log(body.actions[0]);
    const uid = body.actions[0].action_id.replace('admin-toggle-', '');
    const newAdminStatus =
      (body.actions[0]?.selected_options as Option[]).length > 0;
    if (uids) {
      await toggleAdminStatus(uid, newAdminStatus);
    }
    await ack();
  });
}
