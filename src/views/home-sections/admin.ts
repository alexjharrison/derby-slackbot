import { HomeView } from '@slack/bolt';

export const homeAdminView: HomeView['blocks'] = [
  {
    type: 'header',
    text: {
      type: 'plain_text',
      text: ':briefcase:  Admin Stuff  :briefcase:',
    },
  },
  {
    type: 'actions',
    elements: [
      {
        type: 'button',
        text: {
          type: 'plain_text',
          emoji: true,
          text: 'Create an Event',
        },
        style: 'primary',
        value: 'open_event_create_modal',
      },
      {
        type: 'button',
        text: {
          type: 'plain_text',
          emoji: true,
          text: 'Edit Admins',
        },
        value: 'open_edit_admins_modal',
      },
    ],
  },
  {
    type: 'context',
    elements: [
      {
        type: 'mrkdwn',
        text: 'Only admins can see this section. Click Edit Admins to allow others to create events.',
      },
    ],
  },
];
