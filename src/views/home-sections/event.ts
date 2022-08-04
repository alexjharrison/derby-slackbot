import { HomeView } from '@slack/bolt';
import { format } from 'date-fns';
import { Event } from '../../models/event/event.interface';
import { userStore } from '../../models/user/user.store';
import { capitalize } from '../../utils/text';
import { generateRSVPButtons } from './rsvp-buttons';
import { generateRSVPStatus } from './rsvp-status';

export function generateEventRow(
  evt: Event,
  isHomeView = true
): HomeView['blocks'] {
  const eventRows: HomeView['blocks'] = [];

  if (evt.title)
    eventRows.push({
      type: 'header',
      text: {
        text: `${capitalize(evt.title || '')}`,
        type: 'plain_text',
      },
    });

  if (evt.created_by) {
    eventRows.push({
      type: 'context',
      elements: [
        {
          type: 'mrkdwn',
          text: 'Posted by',
        },
        {
          type: 'image',
          image_url: evt.created_by.slack_data?.profile?.image_48 || '',
          alt_text: evt.created_by.slack_data?.name || '',
        },
        {
          type: 'mrkdwn',
          text: `<@${evt.created_by.slack_data?.name}>`,
        },
      ],
    });
  }

  const details = evt.details ? `*Details*: ${evt.details}\n` : '';

  const formattedDate =
    (evt.start_date
      ? `*Date*: \n${format(new Date(evt.start_date), 'PPPP')}\n${format(
          new Date(evt.start_date),
          'p'
        )}`
      : '') +
    (evt.end_date ? ` - ${format(new Date(evt.end_date), 'p')}\n` : '');

  const location_name = evt.location_name
    ? `*Location*: ${evt.location_name}`
    : '';

  const location_address = evt.location_address
    ? `*Address: <https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        evt.location_address
      )}|${evt.location_address}>*`
    : '';

  const textBlock: HomeView['blocks'][number] = {
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: [formattedDate, details, location_name, location_address].join(
        '\n'
      ),
    },
  };

  eventRows.push(textBlock);

  if (isHomeView) {
    eventRows.push(...generateRSVPStatus(evt.id));
    eventRows.push(...generateRSVPButtons(evt));
  }

  if (userStore.getCurrentUser().is_admin && isHomeView) {
    eventRows.push({
      type: 'actions',
      elements: [
        {
          type: 'button',
          action_id: 'open_event_modal',
          value: `${evt.id}`,
          text: {
            text: ':pencil:  Edit Event',
            type: 'plain_text',
          },
        },
        {
          type: 'button',
          style: 'danger',
          value: `${evt.id}`,
          action_id: 'delete_event',
          text: {
            text: ':x:  Delete Event',
            type: 'plain_text',
          },
          confirm: {
            text: {
              text: `Are you sure you want to delete ${evt.title}?`,
              type: 'mrkdwn',
            },
            title: {
              text: 'Confirm Delete',
              type: 'plain_text',
            },
            confirm: { text: 'Delete', type: 'plain_text' },
            deny: { text: 'Cancel', type: 'plain_text' },
            style: 'danger',
          },
        },
        // { type: 'divider' },
      ],
    });
  }

  return eventRows;
}
