import { RsvpStatus } from '../../config/constants';
import { db } from '../../config/supabase';
import { Event } from './event.interface';

export function saveEvent(event: Partial<Event>) {
  return db.from<Event>('events').upsert(event);
}

export async function fetchUpcomingEvents() {
  // console.dir({ users }, { depth: null });

  const upcomingEvents = await db
    .from<Event>('events')
    .select('*')
    .order('end_date', { ascending: false })
    .gt('end_date', new Date().toUTCString());

  return upcomingEvents.data || [];
}
export async function fetchPastEvents() {
  const pastEvents = await db
    .from<Event>('events')
    .select('*')
    .order('end_date', { ascending: true })
    .lte('end_date', new Date().toUTCString());

  return pastEvents.data || [];
}

export function handleRSVP(userId: string, gameId: string, status: RsvpStatus) {
  //
}
