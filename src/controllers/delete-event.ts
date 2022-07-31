import { App } from '@slack/bolt';
import { deleteEventyById } from '../models/event/event.service';
import { userStore } from '../models/user/user.store';
import { generateHomeView } from '../views/home-sections';

export function deleteEvent(app: App) {
  app.action('delete_event', async ({ ack, client, payload }) => {
    await ack();

    if (!('value' in payload)) return;
    const eventId = Number(payload.value);
    const uid = userStore.getCurrentUser().uid;

    await deleteEventyById(eventId);

    client.views.publish({
      user_id: uid,
      view: await generateHomeView(),
    });
  });
}
