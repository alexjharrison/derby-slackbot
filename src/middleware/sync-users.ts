import { App } from '@slack/bolt';
import {
  deleteUsers,
  fetchDbUsers,
  fetchSlackUsers,
  insertUsers,
  // updateRSVP,
} from '../models/user/user.service';
import { userStore } from '../models/user/user.store';

export function syncSlackUsers(app: App) {
  app.use(async ({ next, payload }) => {
    if (!('user' in payload)) {
      await next();
      return;
    }

    const uid = payload.user;
    let dbUsers = await fetchDbUsers();
    const slackUsers = await fetchSlackUsers();

    const slackUids = slackUsers.map(user => user.id as string);
    const dbUids = dbUsers.map(user => user.uid);

    // people that are in the slack room
    // but not saved in the db
    const newUsers = dbUids.filter(dbUid => slackUids.includes(dbUid));

    // people that are in the db
    // but not in the slack room
    const goneUsers = slackUids.filter(slackUid => dbUids.includes(slackUid));

    // sync slack room with the db
    if (goneUsers.length > 0) await deleteUsers(goneUsers);
    if (newUsers.length > 0) {
      await insertUsers(newUsers);
      dbUsers = await fetchDbUsers();
    }

    userStore.users = dbUsers.map(dbUser => ({
      ...dbUser,
      slack_data: slackUsers.find(slackUser => slackUser.id === dbUser.uid),
    }));

    userStore.currentUserIdx = userStore.users.findIndex(
      user => uid === user.uid
    );

    // await updateRSVP(3, 'unsure');
    // await updateRSVP(4, 'unsure');

    await next();
  });
}
