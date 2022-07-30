import { App } from '@slack/bolt';
import { log } from 'console';
import {
  attachCreatedByUser,
  fetchEventById,
} from '../models/event/event.service';
import { eventRsvpListView } from '../views/modals/event-rsvp-list';

export function openEventRsvpList(app: App) {
  // Listen for users opening your App Home

  app.action(
    'list_rsvps_by_event',
    async ({ body, client, payload, ack, logger }) => {
      await ack();

      if (
        payload.type !== 'button' ||
        !('action_ts' in payload) ||
        !('trigger_id' in body)
      )
        return;

      const eventId = +payload.value;
      console.log(`The event of the button you clicked was ${eventId}`);

      const event = await fetchEventById(eventId);
      if (!event) return;

      event.created_by = attachCreatedByUser(event).created_by;

      try {
        const res = await client.views.open({
          trigger_id: body.trigger_id,
          view: eventRsvpListView(event),
        });
        logger.info(res);
      } catch (e: any) {
        log(e.data);
      }
    }
  );
}
