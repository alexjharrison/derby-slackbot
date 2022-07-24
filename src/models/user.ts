export interface User {
  id: number;
  uid: string;
  is_admin: boolean;
  created_at: Date;
  accepted_events: string[];
  rejected_events: string[];
  undecided_events: string[];
}
