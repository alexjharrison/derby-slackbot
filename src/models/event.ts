export interface Event {
  id: string;
  created_at: Date;
  title?: string;
  location?: string;
  start_time?: Date;
  end_time?: Date;
  info?: string;
}
