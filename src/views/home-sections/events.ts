import { HomeView } from '@slack/bolt';
import { Event } from '../../models/event/event.interface';
import { paddingView } from '../padding';
import { generateCompactEventView } from './event-compact';

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

    ...events.flatMap(event => generateCompactEventView(event)),
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
