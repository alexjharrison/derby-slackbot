import { HomeView } from '@slack/bolt';
import { format } from 'date-fns';
import { Event } from '../../models/event/event.interface';
import { getEventStatusByUser } from '../../models/user/user.service';
import { userStore } from '../../models/user/user.store';
import { generateRSVPButtons } from './rsvp-buttons';

export function generateCompactEventView(evt: Event): HomeView['blocks'] {
  const formattedDate =
    (evt.start_date
      ? `*Date*: ${format(new Date(evt.start_date), 'PPPP')}\n${format(
          new Date(evt.start_date),
          'p'
        )}`
      : '') +
    (evt.end_date ? ` - ${format(new Date(evt.end_date), 'p')}\n` : '');

  const status = getEventStatusByUser(evt.id, userStore.getCurrentUser());
  const attendanceEmoji =
    status === 'accepted'
      ? ':white_check_mark:'
      : status === 'rejected'
      ? ':no_entry_sign:'
      : status === 'unsure'
      ? ':question:'
      : ':question:';

  const view: HomeView['blocks'] = [
    {
      type: 'section',
      fields: [
        {
          text: `*${evt.title}*\n\n${formattedDate} *Location*: ${evt.location_name}`,
          type: 'mrkdwn',
        },
      ],
      accessory: {
        type: 'button',
        text: {
          text: 'More Info',
          type: 'plain_text',
        },
        action_id: 'open_event_detail_modal',
        value: `${evt.id}`,
      },
    },
    ...generateRSVPButtons(evt),
    { type: 'divider' },
  ];

  return view;
}
