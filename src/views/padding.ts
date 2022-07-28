import { HomeView } from '@slack/bolt';

export const paddingView: HomeView['blocks'][number] = {
  type: 'section',
  text: {
    type: 'plain_text',
    text: '‎',
  },
};
