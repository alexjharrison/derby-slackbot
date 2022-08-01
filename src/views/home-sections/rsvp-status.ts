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
        text:
          ':white_check_mark: *Attending*: ' +
          (userStatuses.attendingNames.join(', ') || '¯\\_(ツ)_/¯'),
      },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text:
          ':no_entry_sign: *Not Attending*: ' +
          (userStatuses.notAttendingNames.join(', ') || '¯\\_(ツ)_/¯'),
      },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text:
          ':question: *TBD*: ' +
          (userStatuses.unsureNames.join(', ') || '¯\\_(ツ)_/¯'),
      },
    },
  ];

  return view;
}
