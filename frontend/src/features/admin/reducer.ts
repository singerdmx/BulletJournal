import { createSlice, PayloadAction } from 'redux-starter-kit';
import {Role, LockedUser, LockedIP, UserInfo, CategorySteps} from './interface';
import { User } from '../group/interface';

export type setRoleAction = {
  username: string;
  role: Role;
};

export type ChangePointsAction = {
  username: string;
  points: number;
  description: string;
};

export type SetPointsAction = {
  username: string;
  points: number;
};

export type UserRolesAction = {
  usersByRole: User[];
};

export type GetUsersByRoleAction = {
  role: Role;
};

export type GetUserInfoAction = {
  username: string;
};

export type LockedUsersAction = {
  lockedUsers: LockedUser[];
};

export type LockedIPsAction = {
  lockedIPs: LockedIP[];
};

export type UnlockUserAndIPAction = {
  name: string;
  ip: string;
};

export type LockUserAndIPAction = {
  name: string;
  ip: string;
  reason: string;
};

export type UserInfoAction = {
  userInfo: UserInfo;
};

export type UserInfoPointsAction = {
  points: number;
};

export type GetLockedUsersAndIPsAction = {};

export type GetCategoryStepsAction = {
  categoryId: number;
};

export type CategoryStepsAction = {
  categorySteps: CategorySteps;
};

let initialState = {
  usersByRole: [] as User[],
  lockedUsers: [] as LockedUser[],
  lockedIPs: [] as LockedIP[],
  userInfo: {} as UserInfo,
  categorySteps: undefined as CategorySteps | undefined,
};

const slice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    userInfoReceived: (state, action: PayloadAction<UserInfoAction>) => {
      const { userInfo } = action.payload;
      state.userInfo = userInfo;
    },
    userInfoPointsReceived: (
      state,
      action: PayloadAction<UserInfoPointsAction>
    ) => {
      const { points } = action.payload;
      state.userInfo.points = points;
    },
    setRole: (state, action: PayloadAction<setRoleAction>) => state,
    changePoints: (state, action: PayloadAction<ChangePointsAction>) => state,
    setPoints: (state, action: PayloadAction<SetPointsAction>) => state,
    userRolesReceived: (state, action: PayloadAction<UserRolesAction>) => {
      const { usersByRole } = action.payload;
      state.usersByRole = usersByRole;
    },
    getUsersByRole: (state, action: PayloadAction<GetUsersByRoleAction>) =>
      state,
    getUserInfo: (state, action: PayloadAction<GetUserInfoAction>) => state,
    lockedUsersReceived: (state, action: PayloadAction<LockedUsersAction>) => {
      const { lockedUsers } = action.payload;
      state.lockedUsers = lockedUsers;
    },
    lockedIPsReceived: (state, action: PayloadAction<LockedIPsAction>) => {
      const { lockedIPs } = action.payload;
      state.lockedIPs = lockedIPs;
    },
    getLockedUsersAndIPs: (
      state,
      action: PayloadAction<GetLockedUsersAndIPsAction>
    ) => state,
    unlockUserandIP: (state, action: PayloadAction<UnlockUserAndIPAction>) =>
      state,
    lockUserandIP: (state, action: PayloadAction<LockUserAndIPAction>) => state,
    getCategorySteps: (state, action: PayloadAction<GetCategoryStepsAction>) => state,
    categoryStepsReceived: (state, action: PayloadAction<CategoryStepsAction>) => {
      const { categorySteps } = action.payload;
      state.categorySteps = categorySteps;
    },
  },
});

export const reducer = slice.reducer;
export const actions = slice.actions;
