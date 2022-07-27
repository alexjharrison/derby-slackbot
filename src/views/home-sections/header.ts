import { HomeView } from '@slack/bolt';

export const homeHeaderView: HomeView['blocks'] = [
  {
    type: 'header',
    text: {
      type: 'plain_text',
      text: ':roller_skate::roller_skate: DJRD Events :roller_skate::roller_skate:',
    },
  },
  {
    type: 'context',
    elements: [
      {
        text: "*Check out what's happening*  :eyes:",
        type: 'mrkdwn',
      },
    ],
  },
  {
    type: 'divider',
  },
];
