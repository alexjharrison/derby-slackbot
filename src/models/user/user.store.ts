import { reactive } from '@vue/reactivity';
import { testUser, User } from './user.interface';

interface UserStore {
  users: User[];
  currentUser: User;
}

export const userStore: UserStore = {
  users: [],
  currentUser: testUser,
};
