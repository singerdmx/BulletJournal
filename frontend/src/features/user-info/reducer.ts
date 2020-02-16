import { createSlice, PayloadAction } from 'redux-starter-kit';

export type UserInfoWithAvatar = {
  username: string;
  avatar: string;
};

export type UserApiErrorAction = {
  error: string;
};

export type UpdateUserInfo = {};

let initialState = {
  username: '',
  avatar: '',
};

const slice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    UserDataReceived: (state, action: PayloadAction<UserInfoWithAvatar>) => {
      const { username, avatar } = action.payload;
      state.username = username;
      state.avatar = avatar;
    },
    UserApiErrorReceived: (state, action: PayloadAction<UserApiErrorAction>) => state,
    UserInfoUpdate: (state, action: PayloadAction<UpdateUserInfo>) => state
  }
});

export const updateUserInfo = () => actions.UserInfoUpdate({});

export const reducer = slice.reducer;
export const actions = slice.actions;
