import { createSlice, PayloadAction } from 'redux-starter-kit';
import {History} from "history";

export type UserWithAvatar = {
  name: string;
  avatar: string;
  id: number;
  thumbnail: string;
};

export type UserApiErrorAction = {
  error: string;
};

export type UpdateUser = {
  name: string;
};

export type ChangeAlias = {
  targetUser: string;
  alias: string;
  groupId: number;
  history: History<History.PoorMansUnknown>;
};

export type ClearUser = {};

let initialState = {
  name: '',
  avatar: '',
  id: 0,
  thumbnail: ''
};

const slice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    userDataReceived: (state, action: PayloadAction<UserWithAvatar>) => {
      const { name, avatar, id, thumbnail } = action.payload;
      state.name = name;
      state.avatar = avatar;
      state.id = id;
      state.thumbnail = thumbnail;
    },
    userApiErrorReceived: (state, action: PayloadAction<UserApiErrorAction>) =>
      state,
    userUpdate: (state, action: PayloadAction<UpdateUser>) => state,
    userAliasUpdate: (state, action: PayloadAction<ChangeAlias>) => state,
    userClear: (state, action: PayloadAction<ClearUser>) => {
      state.name = '';
      state.avatar = '';
      state.thumbnail = '';
      state.id = 0;
    }
  }
});

export const reducer = slice.reducer;
export const actions = slice.actions;
