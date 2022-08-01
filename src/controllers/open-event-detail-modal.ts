import { App } from '@slack/bolt';
import { Event } from '../models/event/event.interface';
import { fetchEventById } from '../models/event/event.service';
import { generateEventRow } from '../views/home-sections/event';
import { generateEventList } from '../views/home-sections/events';

export function openEventDetailModal(app: App) {
  app.action(
    'open_event_detail_modal',
    async ({ ack, payload, client, body }) => {
      await ack();
      if (payload.type !== 'button' || !('trigger_id' in body)) return;

      let event: Event | undefined = undefined;

      if ('value' in payload) {
        const eventId = +payload.value;
        event = (await fetchEventById(eventId)) || undefined;
      }

      console.log({ event });
      if (event) {
        await client.views.open({
          trigger_id: body.trigger_id,
          view: {
            type: 'modal',
            title: {
              text: event.title || 'Detail View',
              type: 'plain_text',
            },
            blocks: generateEventRow(event),
          },
        });
      }
    }
  );
}
