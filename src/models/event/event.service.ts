import { db } from '../../config/supabase';
import { userStore } from '../user/user.store';
import { Event } from './event.interface';

export function saveEvent(event: Partial<Event>) {
  return db.from<Event>('events').upsert(event);
}

export async function fetchEventById(id: number) {
  const res = await db
    .from<Event>('events')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  const event = res.data && attachCreatedByUser(res.data);

  return event;
}

export async function deleteEventById(id: number) {
  return db.from<Event>('events').delete().eq('id', id);
}

export async function fetchUpcomingEvents() {
  let now = new Date();
  now.setTime(now.getTime() - 7 * 60 * 60 * 1000);
  let upcomingEventsPromise = db
    .from<Event>('events')
    .select()
    .order('start_date', { ascending: true })
    .gt('start_date', now.toUTCString());

  const { selected_event_filter } = userStore.currentUser
  if (selected_event_filter !== 'ALL') {
    upcomingEventsPromise.eq("event_type", selected_event_filter)
  }
  const upcomingEvents = await upcomingEventsPromise

  return (upcomingEvents.data || [])?.map(attachCreatedByUser);
}

export async function fetchPastEvents(limit = 20) {
  let now = new Date();
  now.setTime(now.getTime() - 7 * 60 * 60 * 1000);
  const pastEvents = await db
    .from<Event>('events')
    .select('*')
    .order('start_date', { ascending: false })
    .lte('start_date', now.toUTCString())
    .limit(limit);

  return (pastEvents.data || []).map(attachCreatedByUser);
}

export function attachCreatedByUser(event: Event): Event {
  return {
    ...event,
    created_by: userStore.users.find(
      user => user.uid === event.created_by_user_id
    ),
  };
}
