import { App } from '@slack/bolt';
import { db } from '../config/supabase';
import { User } from '../models/user';
import { generateHomeView } from '../views/home-sections';

export function appHomeOpened(app: App) {
  // Listen for users opening your App Home

  app.event('app_home_opened', async ({ event, client, logger }) => {
    // const users = await client.users.list();
    // console.dir(users, { depth: null });

    const response = await db.from<User>('users').select();
    console.dir({ response }, { depth: null });

    const result = await client.views.publish({
      user_id: event.user,
      view: generateHomeView(true, []),
    });

    // logger.info(result);
  });
}
