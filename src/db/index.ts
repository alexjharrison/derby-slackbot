import { Event } from '../models/event';
import { getDatabase, ref, push, set, query, child } from 'firebase/database';

const db = getDatabase();
const eventListRef = ref(db, 'events');

export async function saveEvent(event: Event) {
  const newEventRef = push(eventListRef);
  await set(newEventRef, event);
}

export function updateEvent(event: Event) {
  //
}

export async function fetchEvents() {
  const events = query(eventListRef);
}

export function handleRSVP(
  userId: string,
  gameId: string,
  status: 'accepted' | 'rejected' | 'unsure'
) {
  //
}

export function addAdmin(uid: string) {
  //
}

export function removeAdmin(uid: string) {
  //
}

export function isUserAdmin(uid: string) {
  //
}
