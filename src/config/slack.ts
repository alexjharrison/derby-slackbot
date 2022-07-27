import { App, ExpressReceiver } from '@slack/bolt';
import { registerEvents } from '../controllers';

const expressReceiver = new ExpressReceiver({
  signingSecret: process.env.slackSigningSecret || '',
  processBeforeResponse: true,
});

const app = new App({
  signingSecret: process.env.slackSigningSecret,
  token: process.env.slackBotToken,
  receiver: expressReceiver,
});

registerEvents(app);

export { app };
