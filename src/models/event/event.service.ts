import { RsvpStatus } from '../../config/constants';
import { db } from '../../config/supabase';
import { users } from '../user/user.store';
import { Event } from './event.interface';

export function saveEvent(event: Partial<Event>) {
  return db.from<Event>('events').upsert(event);
}

export async function fetchUpcomingEvents() {
  let upcomingEvents = await db
    .from<Event>('events')
    .select('*')
    .order('end_date', { ascending: false })
    .gt('end_date', new Date().toUTCString());

  return (upcomingEvents.data || [])?.map(attachCreatedByUser);
}

export async function fetchPastEvents() {
  const pastEvents = await db
    .from<Event>('events')
    .select('*')
    .order('end_date', { ascending: false })
    .lte('end_date', new Date().toUTCString());

  return (pastEvents.data || []).map(attachCreatedByUser);
}

export function attachCreatedByUser(event: Event): Event {
  return {
    ...event,
    created_by: users.find(user => user.uid === event.created_by_user_id),
  };
}

export function handleRSVP(userId: string, gameId: string, status: RsvpStatus) {
  //
}
