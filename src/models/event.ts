export interface Event {
  title: string;
  location: string;
  start_time: string;
  end_time: string;
  info: string;
}

export interface User {
  uid: string;
  accepted_events: string[];
  rejected_events: string[];
  is_admin: boolean;
}
