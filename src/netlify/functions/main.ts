import type { Handler } from '@netlify/functions';
import { ReceiverEvent } from '@slack/bolt';
import { app } from '../../config/slack';
import { fetchSlackUsers } from '../../models/user/user.store';

const handler: Handler = async event => {
  let payload: any = {};

  const body = (event.body || '').replace('payload=', '');
  try {
    payload = JSON.parse(decodeURIComponent(body));
  } catch (e) {
    console.log('JSON parse failed\n', e);
    return {
      statusCode: 500,
      body: 'error parsing',
    };
  }

  console.dir(payload, { depth: null });

  if (payload.type === 'url_verification') {
    return {
      statusCode: 200,
      body: payload.challenge,
    };
  }

  await fetchSlackUsers();

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

  try {
    await app.processEvent(slackEvent);
  } catch (e) {
    console.log('Caught the error woo');
    console.error(e);
  }

  return {
    statusCode: 200,
    body: '',
  };
};

export { handler };
