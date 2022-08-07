import {
  App,
  BlockAction,
  Middleware,
  SlackAction,
  SlackActionMiddlewareArgs,
} from '@slack/bolt';
import { RsvpStatus } from '../config/constants';
import { app } from '../config/slack';
import { deleteDm, fetchDm } from '../models/dm/dm.service';
import { fetchEventById } from '../models/event/event.service';
import { fetchUserByUid, updateRSVP } from '../models/user/user.service';
import { userStore } from '../models/user/user.store';
import { generateHomeView } from '../views/home-sections';
import { generateEventRow } from '../views/home-sections/event';
import { modalStore } from '../views/modals/modal-store';

export function handleRSVPResponse(app: App) {
  app.action<BlockAction>(
    /^rsvp_response/,
    async ({ client, body, ack, payload, say }) => {
      await ack();

      const rsvpStatus = body.actions[0].action_id.replace(
        'rsvp_response_',
        ''
      ) as RsvpStatus;

      if (
        payload.type !== 'button' ||
        !('action_ts' in payload) ||
        !('trigger_id' in body)
      )
        return;
      const uid = body.user.id;
      const eventId = Number(payload.value);
      if (!eventId) return;

      await updateRSVP(eventId, rsvpStatus);

      const event = await fetchEventById(eventId);

      if (!event) return;
      if ('view' in body && body.view?.type === 'modal') {
        await client.views.update({
          view_id: modalStore.latestModalId,
          view: {
            type: 'modal',
            callback_id: 'event_detail_modal',
            title: {
              text: 'Event Details',
              type: 'plain_text',
            },
            blocks: [{ type: 'divider' }, ...generateEventRow(event)],
          },
        });

        await client.views.publish({
          user_id: uid,
          view: await generateHomeView(),
        });
      }

      //delete dm replace with message
      const res = await fetchDm(event.id, uid);
      const dm = res.body?.[0];
      // console.log(dm);
      if (!dm) return;
      try {
        await client.chat.delete({
          channel: dm.channel_id,
          ts: dm.timestamp,
        });

        await deleteDm(dm.id);

        const response =
          rsvpStatus === 'accepted'
            ? 'Glad to see you there'
            : rsvpStatus === 'rejected'
            ? "Sorry you can't make it"
            : rsvpStatus === 'unsure'
            ? ''
            : '';

        if (say) {
          await say(
            {
              blocks: [
                {
                  type: 'divider',
                },
                {
                  type: 'header',
                  text: {
                    text: `RSVP confirmed for ${event.title}`,
                    type: 'plain_text',
                  },
                },
                {
                  type: 'section',
                  text: {
                    text: `${response}\nGo to the Home tab if you want to change your RSVP status for the event`,
                    type: 'mrkdwn',
                  },
                },
              ],
            }
            // `RSVP confirmed for *${event.title}*\n${response}\n\nGo to the Home tab if you want to change your RSVP status for the event`
          );
        }
      } catch (e: any) {
        console.log(e?.message);
      }
    }
  );
}
