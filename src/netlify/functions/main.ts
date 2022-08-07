import type { Handler } from '@netlify/functions';
import { ReceiverEvent } from '@slack/bolt';
import { app } from '../../config/slack';
import { log } from '../../utils/log';

const handler: Handler = async event => {
  let payload: any = {};

  console.log({
    SUPABASE_KEY: process.env.SUPABASE_KEY,
    SUPABASE_URL: process.env.SUPABASE_URL,
    SLACKBOT_TOKEN: process.env.SLACKBOT_TOKEN,
    SLACK_SIGNING_SECRET: process.env.SLACK_SIGNING_SECRET,
  });

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

  try {
    await app.processEvent(slackEvent);
  } catch (e: any) {
    console.log('Caught the error woo');
    log(e.data?.response_metadata?.messages);
  }

  return {
    statusCode: 200,
    body: '',
  };
};

export { handler };
