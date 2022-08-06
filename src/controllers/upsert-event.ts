import { App } from '@slack/bolt';
import { set } from 'date-fns';
import { FORMERR } from 'dns';
import { DirectMessage } from '../models/dm/dm.interface';
import { createDm } from '../models/dm/dm.service';
import { Event } from '../models/event/event.interface';
import { saveEvent } from '../models/event/event.service';
import { userStore } from '../models/user/user.store';
import { generateHomeView } from '../views/home-sections';
import { generateEventRow } from '../views/home-sections/event';
import { generateRSVPButtons } from '../views/home-sections/rsvp-buttons';

export function upsertEvent(app: App) {
  app.view('event_edit_modal', async ({ ack, payload, body, client }) => {
    await ack();

    if (!('state' in payload)) return;
    const event: Partial<Event> = {};

    const state = payload.state.values;

    const date = state.date.data.selected_date as string;
    const startTime = state.start_time.data.selected_time as string;
    const endTime = state.end_time.data.selected_time as string | null;

    const startDatetime = new Date(`${date}T${startTime}:00.000`);
    const endDatetime = endTime && new Date(`${date}T${endTime}:00.000`);

    event.start_date = startDatetime.toUTCString();
    event.created_by_user_id = body.user.id;

    const formatText = (blockId: keyof Event, length = 150) =>
      state[blockId].data.value?.replaceAll('+', ' ').slice(0, length);

    if (payload.private_metadata) {
      event.id = +payload.private_metadata;
    }
    if (endDatetime) {
      event.end_date = endDatetime.toUTCString();
    }
    if (state.title.data.value) {
      event.title = formatText('title');
    }
    if (state.details.data.value) {
      event.details = formatText('details', 500);
    }
    if (state.location_name.data.value) {
      event.location_name = formatText('location_name');
    }
    if (state.location_address.data.value) {
      event.location_address = formatText('location_address', 255);
    }
    if (state.is_cancelled.data.selected_options) {
      event.is_cancelled = state.is_cancelled.data.selected_options.length > 0;
    }

    const savedEvent = (await saveEvent(event)).data;

    await client.views.publish({
      user_id: body.user.id,
      view: await generateHomeView(),
    });

    // DM everyone when a new event is created
    if (!event?.id && savedEvent?.[0] && event.is_cancelled === false) {
      const dms: Partial<DirectMessage>[] = [];

      const promises = userStore.users.map(async user => {
        const conversation = await client.conversations.open({
          users: user.uid,
        });
        if (!conversation.channel?.id) return;

        const res = await client.chat.postMessage({
          channel: conversation.channel.id,
          text: `New Event Created: ${event.title}`,
          blocks: [
            {
              type: 'section',
              text: {
                text: `
*Hey @${user.slack_data?.name}!*

<@${userStore.getCurrentUser().slack_data?.name}> added a new event

RSVP here or browse upcoming events in the Home tab of EventBot

`,
                type: 'mrkdwn',
              },
            },
            ...generateEventRow(savedEvent[0], false),
            ...generateRSVPButtons(savedEvent[0]),
          ],
        });

        dms.push({
          expiry_date: event.end_date || event.start_date,
          user_uid: user.uid,
          channel_id: conversation.channel.id,
          event_id: savedEvent?.[0].id,
          timestamp: res.ts,
        });
      });

      await Promise.allSettled(promises);

      const dmRes = await createDm(dms);
      // console.log(dmRes);
    }
  });
}
