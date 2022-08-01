import { App } from '@slack/bolt';
import { Event } from '../models/event/event.interface';
import { fetchEventById } from '../models/event/event.service';
import { EventEditView } from '../views/modals/event-edit-modal';
import { modalStore } from '../views/modals/modal-store';

export function openEventEditModal(app: App) {
  app.action('open_event_modal', async ({ ack, payload, body, client }) => {
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

    if (body.view?.type === 'home') {
      const res = await client.views.open({
        trigger_id: body.trigger_id,
        view: EventEditView(event),
      });
      modalStore.latestModalId = res.view?.id || '';
    } else if (body.view?.type === 'modal') {
      const res = await client.views.update({
        view_id: modalStore.latestModalId,
        view: EventEditView(event),
      });
      modalStore.latestModalId = res.view?.id || '';
    }
  });
}
