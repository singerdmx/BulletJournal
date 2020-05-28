import { createSlice, PayloadAction } from 'redux-starter-kit';
import { Role, LockedUser, LockedIP } from './interface';
import { User } from '../group/interface';

export type setRoleAction = {
  username: string;
  role: Role;
};

export type UserRolesAction = {
  usersByRole: User[];
};

export type GetUsersByRoleAction = {
  role: Role;
};

export type LockedUsersAction = {
  lockedUsers: LockedUser[];
};

export type LockedIPsAction = {
  lockedIPs: LockedIP[];
};

export type GetBlockedUsersAndIPsAction = {};

let initialState = {
  usersByRole: [] as User[],
  lockedUsers: [] as LockedUser[],
  lockedIPs: [] as LockedIP[],
};

const slice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setRole: (state, action: PayloadAction<setRoleAction>) => state,
    userRolesReceived: (state, action: PayloadAction<UserRolesAction>) => {
      const { usersByRole } = action.payload;
      state.usersByRole = usersByRole;
    },
    getUsersByRole: (state, action: PayloadAction<GetUsersByRoleAction>) =>
      state,
    lockedUsersReceived: (state, action: PayloadAction<LockedUsersAction>) => {
      const { lockedUsers } = action.payload;
      state.lockedUsers = lockedUsers;
    },
    lockedIPsReceived: (state, action: PayloadAction<LockedIPsAction>) => {
      const { lockedIPs } = action.payload;
      state.lockedIPs = lockedIPs;
    },
    getBlockedUsersAndIPs: (
      state,
      action: PayloadAction<GetBlockedUsersAndIPsAction>
    ) => state,
  },
});

export const reducer = slice.reducer;
export const actions = slice.actions;
