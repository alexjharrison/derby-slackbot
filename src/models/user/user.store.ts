import { testUser, User } from './user.interface';
class UserStore {
  constructor
    (
      public users: User[] = [],
      public currentUser: User = testUser
    ) { }
}

export const userStore = new UserStore()