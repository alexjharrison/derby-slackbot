import { App } from '@slack/bolt';
import { set } from 'date-fns';
import { DirectMessage } from '../models/dm/dm.interface';
import { Event } from '../models/event/event.interface';
import { saveEvent } from '../models/event/event.service';
import { userStore } from '../models/user/user.store';
import { generateHomeView } from '../views/home-sections';
import { generateEventRow } from '../views/home-sections/event';

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

    if (payload.private_metadata) {
      event.id = +payload.private_metadata;
    }
    if (endDatetime) {
      event.end_date = endDatetime.toUTCString();
    }
    if (state.title.data.value) {
      event.title = state.title.data.value.replaceAll('+', ' ');
    }
    if (state.details.data.value) {
      event.details = state.details.data.value.replaceAll('+', ' ');
    }
    if (state.location_name.data.value) {
      event.location_name = state.location_name.data.value.replaceAll('+', ' ');
    }
    if (state.location_address.data.value) {
      event.location_address = state.location_address.data.value.replaceAll(
        '+',
        ' '
      );
    }

    const savedEvent = (await saveEvent(event)).data;

    await client.views.publish({
      user_id: body.user.id,
      view: await generateHomeView(),
    });

    // DM everyone when a new event is created
    if (!event?.id && savedEvent?.[0]) {
      const dms: Partial<DirectMessage>[] = [];

      userStore.users.forEach(async user => {
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
          ],
        });

        dms.push({});
      });
    }
  });
}
