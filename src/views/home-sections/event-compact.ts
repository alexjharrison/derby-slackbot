import { HomeView } from '@slack/bolt';
import { format } from 'date-fns';
import { Event } from '../../models/event/event.interface';
import { getEventStatusByUser } from '../../models/user/user.service';
import { userStore } from '../../models/user/user.store';
import { emojifyTitle } from '../../utils/text';

export function generateCompactEventView(evt: Event): HomeView['blocks'] {
  const formattedDate =
    (evt.start_date
      ? `*Date*: ${format(new Date(evt.start_date), 'PPPP')}\n${format(
        new Date(evt.start_date),
        'p'
      )}`
      : '') +
    (evt.end_date ? ` - ${format(new Date(evt.end_date), 'p')}\n` : '');

  const status = getEventStatusByUser(evt.id, userStore.currentUser);
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
          text:
            `*${emojifyTitle(evt)}*\n${formattedDate}\n` +
            (evt.location_name ? `*Location*: ${evt.location_name}` : ''),
          type: 'mrkdwn',
        },
        {
          text: `‎*Attending*:  ${attendanceEmoji}`,
          type: 'mrkdwn',
        },
        {
          text: `‎\n`,
          type: 'mrkdwn',
        },
      ],
      accessory: {
        type: 'button',
        text: {
          text: 'More Info' + (evt.is_cancelled ? '' : ' / RSVP'),
          type: 'plain_text',
        },
        style: 'primary',
        action_id: 'open_event_detail_modal',
        value: `${evt.id}`,
      },
    },
    { type: 'divider' },
  ];

  if (evt.is_cancelled && 'fields' in view?.[0] && view[0].fields?.[1]) {
    view[0].fields[1].text = '*Status: Cancelled*';
  }

  return view;
}
