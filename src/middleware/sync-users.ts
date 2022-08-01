import { App } from '@slack/bolt';
import {
  deleteUsers,
  fetchDbUsers,
  fetchSlackUsers,
  insertUsers,
  removeEventFromAllUsers,
  updateRSVP,
} from '../models/user/user.service';
import { userStore } from '../models/user/user.store';

export function syncSlackUsers(app: App) {
  app.use(async ({ next, payload, body }) => {
    let uid: string;

    if ('user' in payload) {
      uid = payload.user;
    } else if ('user' in body && 'id' in body.user) {
      uid = body.user.id;
    } else {
      console.log("Didn't sync users");
      await next();
      return;
    }
    console.log('Users synced');

    let dbUsers = await fetchDbUsers();
    const slackUsers = await fetchSlackUsers();

    const slackUids = slackUsers.map(user => user.id as string);
    const dbUids = dbUsers.map(user => user.uid);

    // people that are in the slack room
    // but not saved in the db
    const newUsers = slackUids.filter(slackUid => !dbUids.includes(slackUid));

    // people that are in the db
    // but not in the slack room
    const goneUsers = dbUids.filter(dbUid => !slackUids.includes(dbUid));

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

    await next();
  });
}
