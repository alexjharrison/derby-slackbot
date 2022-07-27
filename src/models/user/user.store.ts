import { UsersListResponse } from '@slack/web-api';
import { app } from '../../config/slack';

export async function fetchSlackUsers() {
  const users = await app.client.users.list();
  slackUsers = users.members?.filter(
    user => !user.is_bot && user.name !== 'slackbot'
  );
}

export let slackUsers: UsersListResponse['members'] = [];
