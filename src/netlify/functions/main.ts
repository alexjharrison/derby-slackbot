import type { Handler } from '@netlify/functions';
import { ReceiverEvent } from '@slack/bolt';
import { app } from '../../config/slack';

const handler: Handler = async event => {
  const payload = JSON.parse(event.body || '');

  if (payload.type === 'url_verification') {
    return {
      statusCode: 200,
      body: payload.challenge,
    };
  }

  const slackEvent: ReceiverEvent = {
    body: payload,
    ack: async response => {
      return new Promise<void>((resolve, reject) => {
        resolve();
        return {
          statusCode: 200,
          body: response ?? '',
        };
      });
    },
  };

  await app.processEvent(slackEvent);

  return {
    statusCode: 200,
    body: '',
  };
};

export { handler };
