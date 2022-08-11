import { App, ViewSubmitAction } from '@slack/bolt';
import { addAllAdmins, removeAllAdmins } from '../models/user/user.service';

export function toggleAdmin(app: App) {
  app.view<ViewSubmitAction>('admin_modal', async ({ ack, payload, body }) => {
    await ack();

    const adminUserUids = payload.state.values.data.data.selected_users || [];
    adminUserUids.push(body.user.id);

    await removeAllAdmins();
    await addAllAdmins(adminUserUids);
  });
}
