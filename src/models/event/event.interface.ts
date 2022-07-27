import { User } from '../user/user.interface';

export interface Event {
  id: number;
  created_at: string;
  title?: string;
  location_name?: string;
  location_address?: string;
  start_date?: string;
  end_date?: string;
  details?: string;
  created_by_user_id?: string;
  created_by?: User;
}
