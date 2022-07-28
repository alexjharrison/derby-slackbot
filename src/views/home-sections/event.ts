import { HomeView } from '@slack/bolt';
import { format } from 'date-fns';
import { Event } from '../../models/event/event.interface';
import { generateRSVPButtons } from './rsvp-buttons';

export function generateEventRow(evt: Event): HomeView['blocks'] {
  const eventRows: HomeView['blocks'] = [];

  if (evt.title)
    eventRows.push({
      type: 'section',
      text: {
        text: `*${evt.title.toUpperCase()}*`,
        type: 'mrkdwn',
      },
      accessory: {
        type: 'button',
        text: {
          type: 'plain_text',
          text: "See Who's Coming :incoming_envelope:",
        },
      },
    });

  const details = evt.details ? `*Details*: ${evt.details}` : '';

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
    ? `*Address*: ${evt.location_address}`
    : '';

  const created_by = evt.created_by?.slack_data
    ? `\nPosted by <@${evt.created_by.slack_data?.name}>\n`
    : '';

  const textBlock: HomeView['blocks'][number] = {
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: [
        formattedDate,
        details,
        location_name,
        location_address,
        created_by,
      ].join('\n'),
    },
  };

  if (evt.location_address) {
    textBlock.accessory = {
      type: 'button',
      text: { type: 'plain_text', text: 'Directions :car:' },
      url: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        evt.location_address
      )}`,
    };
  }

  eventRows.push(textBlock);
  eventRows.push(...generateRSVPButtons(evt));
  eventRows.push({ type: 'divider' });

  return eventRows;
}
