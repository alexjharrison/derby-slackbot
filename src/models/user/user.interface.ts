import { UsersListResponse } from '@slack/web-api';
import { EventTypeWithAll } from '../../config/constants';

export interface User {
  id: number;
  uid: string;
  is_admin: boolean;
  created_at: string;
  selected_event_filter: EventTypeWithAll
  accepted_events: number[];
  rejected_events: number[];
  undecided_events: number[];
  slack_data?: NonNullable<UsersListResponse['members']>[number];
}

export const testUser: User = {
  id: 1,
  uid: '',
  is_admin: false,
  selected_event_filter: "ALL",
  created_at: new Date().toUTCString(),
  accepted_events: [],
  rejected_events: [],
  undecided_events: [],
};
