import { db } from '../../config/supabase';
import { DirectMessage } from './dm.interface';

export function fetchExpiredDms() {
  return db
    .from<DirectMessage>('dms')
    .select('*')
    .lt('expiry_date', new Date().toUTCString());
}

export function createDm(
  dms: Partial<DirectMessage> | Partial<DirectMessage>[]
) {
  return db.from<DirectMessage>('dms').insert(dms);
}

export function fetchDm(eventId: number, uid: string) {
  return db
    .from<DirectMessage>('dms')
    .select('*')
    .match({ user_uid: uid, event_id: eventId });
}

export function deleteDm(dmId: number) {
  return db.from<DirectMessage>('dms').delete().eq('id', dmId);
}
export function deleteDms(dmIds: number[]) {
  return db.from<DirectMessage>('dms').delete().in('id', dmIds);
}

export function fetchDmsByEvent(eventId: number) {
  return db.from<DirectMessage>('dms').select('*').eq('event_id', eventId);
}
export function deleteDmsByEvent(eventId: number) {
  return db.from<DirectMessage>('dms').delete().eq('event_id', eventId);
}
