import { App } from '@slack/bolt';
import { Event } from '../models/event/event.interface';
import { fetchEventById } from '../models/event/event.service';
import { EventEditView } from '../views/modals/event-edit-modal';

export function openEventModal(app: App) {
  app.action('open_event_modal', async ({ ack, payload, body, client }) => {
    await ack();

    if (payload.type !== 'button' || !('trigger_id' in body)) return;

    let event: Event | undefined = undefined;

    if ('value' in payload) {
      const eventId = +payload.value;
      event = (await fetchEventById(eventId)) || undefined;
    }

    await client.views.open({
      trigger_id: body.trigger_id,
      view: EventEditView(event),
    });
  });
}
