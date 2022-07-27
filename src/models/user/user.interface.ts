export interface User {
  id: number;
  uid: string;
  is_admin: boolean;
  created_at: string;
  accepted_events: string[];
  rejected_events: string[];
  undecided_events: string[];
}
