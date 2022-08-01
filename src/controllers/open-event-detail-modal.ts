import { App } from '@slack/bolt';
import { Event } from '../models/event/event.interface';
import { fetchEventById } from '../models/event/event.service';
import { generateEventRow } from '../views/home-sections/event';
import { generateEventList } from '../views/home-sections/events';
import { modalStore } from '../views/modals/modal-store';

export function openEventDetailModal(app: App) {
  app.action(
    'open_event_detail_modal',
    async ({ ack, payload, client, body }) => {
      await ack();
      if (
        payload.type !== 'button' ||
        !('trigger_id' in body) ||
        !('view' in body)
      )
        return;

      let event: Event | undefined = undefined;

      if ('value' in payload) {
        const eventId = +payload.value;
        event = (await fetchEventById(eventId)) || undefined;
      }

      if (event) {
        const res = await client.views.open({
          trigger_id: body.trigger_id,
          view: {
            type: 'modal',
            callback_id: 'event_detail_modal',
            title: {
              text: 'Event Details',
              type: 'plain_text',
            },
            blocks: generateEventRow(event),
          },
        });

        modalStore.latestModalId = res.view?.id || '';
      }
    }
  );
}
