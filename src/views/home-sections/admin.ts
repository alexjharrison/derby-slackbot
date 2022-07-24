import { HomeView } from '@slack/bolt';

export const homeAdminView: HomeView['blocks'] = [
  {
    type: 'actions',
    elements: [
      {
        type: 'button',
        style: 'primary',
        text: {
          type: 'plain_text',
          text: 'Create a new event',
          emoji: true,
        },
        action_id: 'open_new_event_modal',
      },
    ],
  },
];
