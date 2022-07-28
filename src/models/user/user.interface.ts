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
