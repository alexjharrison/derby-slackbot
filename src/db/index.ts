import { db } from '../config/supabase';
import { Event } from '../models/event';
import { User } from '../models/user';

export function saveEvent(event: Partial<Event>) {
  return db.from<Event>('events').upsert(event);
}

export async function fetchEvents() {
  return db.from<Event>('events').select();
}

export function handleRSVP(
  userId: string,
  gameId: string,
  status: 'accepted' | 'rejected' | 'unsure'
) {
  //
}

export function fetchAdminList() {
  return db.from<User>('admins').select().match({ is_admin: true });
}

export async function addAdmin(uid: string) {
  const admins = await fetchAdminList();
  db.from<User>('users');
}

export async function removeAdmin(uid: string) {
  //
}

export async function isUserAdmin(uid: string) {
  const users = await fetchAdminList();
  const user = users.data?.find(user => user.uid === uid);
  return !!user;
}
