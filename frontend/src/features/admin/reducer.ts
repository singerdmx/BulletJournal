import { createSlice, PayloadAction } from 'redux-starter-kit';
import { Role } from './interface';

export type setRoleAction = {
  username: string;
  role: Role;
};

let initialState = {};

const slice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setRole: (state, action: PayloadAction<setRoleAction>) => state,
  },
});

export const reducer = slice.reducer;
export const actions = slice.actions;
