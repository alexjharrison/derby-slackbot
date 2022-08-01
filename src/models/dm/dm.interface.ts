import { Event } from '../event/event.interface';
import { User } from '../user/user.interface';

export interface DirectMessage {
  id: number;
  created_at: string;
  expiry_date?: string;
  user_uid: string;
  user?: User;
  channel_id: string;
  timestamp: string;
  event_id?: number;
  event?: Event;
}
