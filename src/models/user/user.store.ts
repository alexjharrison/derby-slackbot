import { User } from './user.interface';

interface UserStore {
  users: User[];
  currentUserIdx: number;
  getCurrentUser(): User;
}

export const userStore: UserStore = {
  users: [],
  currentUserIdx: -1,
  getCurrentUser: () => userStore.users[userStore.currentUserIdx],
};
