import { HomeView } from '@slack/bolt';
import { Event } from '../../models/event';

export function generateHomeGameListView(events: Event[]): HomeView['blocks'] {
  return [
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
}
