import { HomeView } from '@slack/bolt';
import { Event } from '../../models/event/event.interface';
import { format } from 'date-fns';
import { generateRSVPButtons } from './rsvp-buttons';
import { generateEventRow } from './event';
import { paddingView } from '../padding';

export function generateEventList(
  headerText: string,
  events: Event[]
): HomeView['blocks'] {
  const eventList: HomeView['blocks'] = [
    {
      type: 'header',
      text: {
        type: 'plain_text',
        text: `:calendar:  ${headerText}  :calendar:`,
      },
    },

    { type: 'divider' },

    ...events.flatMap(generateEventRow),
  ];

  if (events.length === 0) {
    eventList.push({
      type: 'section',
      text: {
        type: 'plain_text',
        text: 'Nothing here...',
      },
    });
  }

  eventList.push(paddingView);

  return eventList;
}
