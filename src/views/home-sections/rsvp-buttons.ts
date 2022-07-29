import { HomeView } from '@slack/bolt';
import { RsvpStatus } from '../../config/constants';
import { Event } from '../../models/event/event.interface';
import { userStore } from '../../models/user/user.store';

export function generateRSVPButtons(evt: Event): HomeView['blocks'] {
  function getCurrentUserEventStatus(): RsvpStatus | undefined {
    const currentUser = userStore.getCurrentUser();

    if (currentUser?.accepted_events.includes(evt.id)) {
      return 'accepted';
    } else if (currentUser?.rejected_events.includes(evt.id)) {
      return 'rejected';
    } else if (currentUser?.undecided_events.includes(evt.id)) {
      return 'unsure';
    } else return undefined;
  }

  function getStyleByButton(buttonStatus: RsvpStatus): 'primary' | undefined {
    const status = getCurrentUserEventStatus();
    if (status === buttonStatus) return 'primary';
    else return undefined;
  }

  return [
    {
      type: 'actions',
      elements: [
        {
          type: 'button',
          text: { type: 'plain_text', text: "I'm Going! :raised_hands:" },
          style: getStyleByButton('accepted'),
          value: `accepted_${evt.id}`,
        },
        {
          type: 'button',
          text: { type: 'plain_text', text: "Can't Make It :cry:" },
          style: getStyleByButton('rejected'),
          value: `rejected_${evt.id}`,
        },
        {
          type: 'button',
          text: { type: 'plain_text', text: 'Not Sure :woman-shrugging:' },
          style: getStyleByButton('unsure'),
          value: `unsure_${evt.id}`,
        },
      ],
    },
  ];
}
