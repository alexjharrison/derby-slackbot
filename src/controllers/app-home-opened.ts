import { App } from '@slack/bolt';
import { generateHomeView } from '../views/home-sections';

export function appHomeOpened(app: App) {
  // Listen for users opening your App Home

  app.event('app_home_opened', async ({ event, client, logger }) => {
    console.log('app_home_opened here');
    const users = await client.users.list({});

    const result = await client.views.publish({
      user_id: event.user,
      view: await generateHomeView(true),
    });

    // logger.info(result);
  });
}