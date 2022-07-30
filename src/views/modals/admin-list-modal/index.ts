import { ModalView } from '@slack/bolt';
import { userStore } from '../../../models/user/user.store';

export function adminListView(uid: string): ModalView {
  const users = userStore.users.filter(user => user.uid !== uid);

  const view: ModalView = {
    type: 'modal',
    title: {
      type: 'plain_text',
      text: 'Edit Admins',
    },
    callback_id: 'admin_modal_' + uid,
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: 'Choose users to create and update events',
        },
      },
      {
        type: 'actions',
        block_id: 'edit-admin-checkbox',
        elements: users.map(user => ({
          type: 'checkboxes',
          initial_options: user.is_admin
            ? [
                {
                  text: {
                    text:
                      user.slack_data?.real_name ||
                      user.slack_data?.name ||
                      'Error Fetching name',
                    type: 'mrkdwn',
                  },
                  value: user.uid,
                },
              ]
            : undefined,
          options: [
            {
              text: {
                text:
                  user.slack_data?.real_name ||
                  user.slack_data?.name ||
                  'Error Fetching name',
                type: 'mrkdwn',
              },
              value: user.uid,
            },
          ],
          action_id: `admin-toggle-${user.uid}`,
        })),
      },
    ],
  };

  return view;
}
