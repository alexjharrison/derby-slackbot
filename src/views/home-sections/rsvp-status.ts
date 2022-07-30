import { HomeView } from '@slack/bolt';
import { getEventStatusByUser } from '../../models/user/user.service';
import { userStore } from '../../models/user/user.store';

type UserStatus = {
  attendingNames: string[];
  notAttendingNames: string[];
  unsureNames: string[];
};

export function generateRSVPStatus(eventId: number): Blocks {
  const userStatuses = userStore.users.reduce<UserStatus>(
    (acc, user) => {
      const username = user.slack_data?.name || '';
      const status = getEventStatusByUser(eventId, user);

      if (status === 'accepted') {
        acc.attendingNames.push(`<@${username}>`);
      } else if (status === 'rejected') {
        acc.notAttendingNames.push(`<@${username}>`);
      } else if (status === 'unsure') {
        acc.unsureNames.push(`<@${username}>`);
      }

      return acc;
    },
    {
      attendingNames: [],
      notAttendingNames: [],
      unsureNames: [],
    }
  );

  const view: HomeView['blocks'] = [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: ':white_check_mark: *Attending*:',
      },
    },
    {
      type: 'context',
      elements: [
        {
          type: 'mrkdwn',
          text: userStatuses.attendingNames.join(', '),
        },
      ],
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: ':no_entry_sign: *Not Attending*:',
      },
    },
    {
      type: 'context',
      elements: [
        {
          type: 'mrkdwn',
          text: userStatuses.notAttendingNames.join(', '),
        },
      ],
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: ':question: *TBD*:',
      },
    },
    {
      type: 'context',
      elements: [
        {
          type: 'mrkdwn',
          text: userStatuses.unsureNames.join(', '),
        },
      ],
    },
  ].filter(
    // slack errors if text string is '', take them out
    block =>
      block.type === 'section' || block.elements?.every(({ text }) => text)
  );

  return view;
}
