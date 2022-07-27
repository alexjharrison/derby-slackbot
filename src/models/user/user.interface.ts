import { UsersListResponse } from '@slack/web-api';

export interface User {
  id: number;
  uid: string;
  is_admin: boolean;
  created_at: string;
  accepted_events: string[];
  rejected_events: string[];
  undecided_events: string[];
  slack_data?: NonNullable<UsersListResponse['members']>[number];
}
