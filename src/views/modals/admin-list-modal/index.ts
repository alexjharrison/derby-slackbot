import { ModalView } from '@slack/bolt';
import { userStore } from '../../../models/user/user.store';

export function adminListView(uid: string): ModalView {
  const users = userStore.users;

  const view: ModalView = {
    type: 'modal',
    title: {
      type: 'plain_text',
      text: 'Edit Admins',
    },
    callback_id: 'admin_modal',
    submit: {
      type: 'plain_text',
      text: 'Save',
    },
    close: {
      text: 'Cancel',
      type: 'plain_text',
    },
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: 'Choose users to create and update events',
        },
      },
      {
        type: 'input',
        block_id: 'data',
        element: {
          initial_users: users
            .filter(user => user.is_admin)
            .map(user => user.uid),
          type: 'multi_users_select',
          placeholder: {
            type: 'plain_text',
            text: 'Select users to become admins',
            emoji: true,
          },
          action_id: 'data',
        },
        label: {
          type: 'plain_text',
          text: 'Admins',
        },
      },
    ],
  };

  return view;
}
