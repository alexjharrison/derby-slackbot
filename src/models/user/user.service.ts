import { RsvpStatus } from '../../config/constants';
import { app } from '../../config/slack';
import { db } from '../../config/supabase';
import { User } from './user.interface';
import { userStore } from './user.store';

export async function fetchDbUsers() {
  const users = await db.from<User>('users').select('*');
  return users.data || [];
}

export async function toggleAdminStatus(uid: string, newAdminStatus: boolean) {
  await db
    .from<User>('users')
    .update({ is_admin: newAdminStatus })
    .eq('uid', uid);
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

export function fetchUserByUid(uid: string) {
  return userStore.users.find(user => user.uid === uid);
}

export function removeEventFromAllUsers(eventId: number) {
  const userData: Partial<User>[] = userStore.users.map(user => {
    const { slack_data, ...rest } = user;
    return {
      ...rest,
      accepted_events: user.accepted_events.filter(id => id !== eventId),
      rejected_events: user.rejected_events.filter(id => id !== eventId),
      undecided_events: user.undecided_events.filter(id => id !== eventId),
    };
  });

  return db.from<User>('users').upsert(userData);
}

export function getEventStatusByUser(
  eventId: number,
  user: User
): RsvpStatus | undefined {
  if (user.accepted_events.includes(eventId)) {
    return 'accepted';
  } else if (user.rejected_events.includes(eventId)) {
    return 'rejected';
  } else if (user.undecided_events.includes(eventId)) {
    return 'unsure';
  } else return undefined;
}

export async function updateRSVP(
  eventId: number,
  newStatus: RsvpStatus,
  userWithSlack: User = userStore.currentUser
) {
  const { slack_data, ...user } = userWithSlack;

  user.accepted_events = user.accepted_events.filter(
    evtIds => evtIds !== eventId
  );
  user.rejected_events = user.rejected_events.filter(
    evtIds => evtIds !== eventId
  );
  user.undecided_events = user.undecided_events.filter(
    evtIds => evtIds !== eventId
  );

  if (newStatus === 'accepted') {
    user.accepted_events.push(eventId);
  } else if (newStatus === 'rejected') {
    user.rejected_events.push(eventId);
  } else if (newStatus === 'unsure') {
    user.undecided_events.push(eventId);
  }

  const res = await db
    .from<User>('users')
    .update({
      accepted_events: user.accepted_events,
      rejected_events: user.rejected_events,
      undecided_events: user.undecided_events,
    })
    .match({ id: user.id });

  // update global users list
  const userIndex = userStore.users.findIndex(
    dbUser => dbUser.uid === user.uid
  );
  userStore.users[userIndex] = {
    ...userStore.users[userIndex],
    accepted_events: res.data?.[0].accepted_events || [],
    rejected_events: res.data?.[0].rejected_events || [],
    undecided_events: res.data?.[0].undecided_events || [],
  };
}
