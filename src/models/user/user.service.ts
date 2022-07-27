import { db } from '../../config/supabase';
import { User } from './user.interface';

export async function fetchDbUsers() {
  return (await db.from<User>('users').select('*')).data || [];
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
