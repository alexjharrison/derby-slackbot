import { ModalView, View } from '@slack/bolt';

export const addEventModal: ModalView = {
  type: 'modal',
  title: {
    text: 'Modal',
    type: 'plain_text',
    emoji: true,
  },
  blocks: [
    {
      type: 'test',
    },
  ],
};
