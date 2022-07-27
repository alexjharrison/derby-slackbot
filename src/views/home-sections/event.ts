import { HomeView } from '@slack/bolt';
import { Event } from '../../models/event/event.interface';

export function generateEventList(
  headerText: string,
  events: Event[]
): HomeView['blocks'] {
  return [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `:calendar:| *${headerText}* |:calendar:`,
      },
    },

    ...events.flatMap(generateEventRow),

    { type: 'divider' },
  ];
}

function generateEventRow(evt: Event): HomeView['blocks'] {
  const eventRows: HomeView['blocks'] = [];

  if (evt.title)
    eventRows.push({
      type: 'section',
      text: {
        text: `*${evt.title}*`,
        type: 'mrkdwn',
      },
    });

  if (evt.details)
    eventRows.push({
      type: 'section',
      text: {
        text: `*Details*: ${evt.details}`,
        type: 'mrkdwn',
      },
    });

  return eventRows;
}
