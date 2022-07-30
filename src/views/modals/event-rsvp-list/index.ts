import { ModalView } from '@slack/bolt';
import { Event } from '../../../models/event/event.interface';
import { getEventStatusByUser } from '../../../models/user/user.service';
import { userStore } from '../../../models/user/user.store';

export function eventRsvpListView(event: Event): ModalView {
  const view: ModalView = {
    type: 'modal',
    title: {
      text: event.title || 'Event',
      type: 'plain_text',
      emoji: true,
    },
    callback_id: 'view_1',
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: 'Latest Attendance Status',
        },
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `Event ID: ${JSON.stringify(event)}`,
        },
      },
    ],
  };

  for (const user of userStore.users) {
    const status = getEventStatusByUser(event.id, user);
    view.blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: user.slack_data?.name || 'Fallback name',
      },
      accessory: {
        type: 'image',
        image_url: user.slack_data?.profile?.image_24 || '',
        alt_text: '',
      },
    });
  }
  return view;
}
