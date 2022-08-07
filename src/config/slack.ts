import { App, ExpressReceiver } from '@slack/bolt';
import { registerEvents } from '../controllers';

const expressReceiver = new ExpressReceiver({
  signingSecret: process.env.slackSigningSecret || '',
  processBeforeResponse: true,
});

const app = new App({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  token: process.env.SLACKBOT_TOKEN,
  receiver: expressReceiver,
});

registerEvents(app);

export { app };
