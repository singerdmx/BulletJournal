import { createSlice, PayloadAction } from 'redux-starter-kit';
import { Role } from './interface';
import { User } from '../group/interface';

export type setRoleAction = {
  username: string;
  role: Role;
};

export type UserRolesAction = {
  userRoles: User[];
};

export type GetUsersByRoleAction = {
  role: Role;
};

let initialState = {
  userRoles: [] as User[],
};

const slice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setRole: (state, action: PayloadAction<setRoleAction>) => state,
    userRolesReceived: (state, action: PayloadAction<UserRolesAction>) => {
      const { userRoles } = action.payload;
      state.userRoles = userRoles;
    },
    getUsersByRole: (state, action: PayloadAction<GetUsersByRoleAction>) =>
      state,
  },
});

export const reducer = slice.reducer;
export const actions = slice.actions;
