import { app } from '../../config/slack';
import { db } from '../../config/supabase';
import { User } from './user.interface';

export async function fetchDbUsers() {
  return (await db.from<User>('users').select('*')).data || [];
}

export async function fetchSlackUsers() {
  return ((await app.client.users.list()).members || []).filter(
    user => !user.is_bot && user.name !== 'slackbot'
  );
}

export async function insertUsers(uids: string[]) {
  return (await db.from<User>('users').insert(uids.map(uid => ({ uid })))).data;
}

export async function deleteUsers(uids: string[]) {
  await db
    .from<User>('users')
    .delete()
    .or(uids.map(uid => `uid.eq.${uid}`).join(','));
}

export async function fetchAdminList() {
  const users = await fetchDbUsers();
  return users.filter(user => user.is_admin);
}

export async function addAdmin(uid: string) {
  if (!(await isUserAdmin(uid))) {
    await db.from<User>('users').update({ is_admin: true }).match({ uid });
  }
}

export async function removeAdmin(uid: string) {
  if (await isUserAdmin(uid)) {
    await db.from<User>('users').update({ is_admin: false }).match({ uid });
  }
}

export async function isUserAdmin(uid: string) {
  const users = await fetchAdminList();
  const user = users.find(user => user.uid === uid);
  return !!user;
}
