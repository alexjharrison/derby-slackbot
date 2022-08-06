import { UsersListResponse } from '@slack/web-api';

export interface User {
  id: number;
  uid: string;
  is_admin: boolean;
  created_at: string;
  accepted_events: number[];
  rejected_events: number[];
  undecided_events: number[];
  slack_data?: NonNullable<UsersListResponse['members']>[number];
}

export const testUser: User = {
  id: 1,
  uid: '',
  is_admin: false,
  created_at: new Date().toUTCString(),
  accepted_events: [],
  rejected_events: [],
  undecided_events: [],
};
