import { HomeView } from '@slack/bolt';
import { RsvpStatus } from '../../config/constants';
import { Event } from '../../models/event/event.interface';
import { getEventStatusByUser } from '../../models/user/user.service';
import { userStore } from '../../models/user/user.store';

export function generateRSVPButtons(evt: Event): HomeView['blocks'] {
  const currentUser = userStore.currentUser;
  const status = getEventStatusByUser(evt.id, currentUser);

  function getStyleByButton(buttonStatus: RsvpStatus): 'primary' | undefined {
    if (status === buttonStatus) return 'primary';
    else return undefined;
  }

  const buttons: HomeView['blocks'] = [
    {
      type: 'actions',
      elements: [
        {
          type: 'button',
          text: { type: 'plain_text', text: "I'm Going! :raised_hands:" },
          style: getStyleByButton('accepted'),
          value: `${evt.id}`,
          action_id: 'rsvp_response_accepted',
        },
        {
          type: 'button',
          text: { type: 'plain_text', text: "Can't Make It :cry:" },
          style: getStyleByButton('rejected'),
          value: `${evt.id}`,
          action_id: 'rsvp_response_rejected',
        },
        {
          type: 'button',
          text: { type: 'plain_text', text: 'Not Sure :woman-shrugging:' },
          style: getStyleByButton('unsure'),
          value: `${evt.id}`,
          action_id: 'rsvp_response_unsure',
        },
      ],
    },
  ];

  // const text =
  //   status === 'accepted'
  //     ? '*Your Status*: Attending'
  //     : status === 'rejected'
  //     ? '*Your Status*: Not Attending'
  //     : status === 'unsure'
  //     ? '*Your Status*: TBD'
  //     : '';

  // if (status) {
  //   buttons.unshift({
  //     type: 'section',
  //     text: {
  //       type: 'mrkdwn',
  //       text,
  //     },
  //   });
  // }

  return buttons;
}
