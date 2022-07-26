import { App } from '@slack/bolt';
import { deleteDmsByEvent, fetchDmsByEvent } from '../models/dm/dm.service';
import { deleteEventById } from '../models/event/event.service';
import { removeEventFromAllUsers } from '../models/user/user.service';
import { userStore } from '../models/user/user.store';
import { generateHomeView } from '../views/home-sections';
import { modalStore } from '../views/modals/modal-store';

export function deleteEvent(app: App) {
  app.action('delete_event', async ({ ack, client, payload }) => {
    await ack();

    if (!('value' in payload)) return;
    const eventId = Number(payload.value);
    const uid = userStore.currentUser?.uid;

    const dmsToDelete = (await fetchDmsByEvent(eventId)).data;

    try {
      dmsToDelete?.forEach(async dm => {
        await client.chat.delete({
          channel: dm.channel_id,
          ts: dm.timestamp,
        });
      });
    } catch (e) {
      console.log('failed to delete dm after deleting event');
    }

    await deleteDmsByEvent(eventId);

    await deleteEventById(eventId);
    await removeEventFromAllUsers(eventId);

    await client.views.update({
      view_id: modalStore.latestModalId,
      view: {
        type: 'modal',
        title: {
          text: 'Success',
          type: 'plain_text',
        },
        blocks: [
          {
            type: 'section',
            text: {
              text: 'Event has been successfully deleted :white_check_mark:',
              type: 'plain_text',
            },
          },
        ],
      },
    });

    await client.views.publish({
      user_id: uid,
      view: await generateHomeView(),
    });
  });
}
