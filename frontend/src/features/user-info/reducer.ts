import { createSlice, PayloadAction } from 'redux-starter-kit';

export type MyselfWithAvatar = {
  username: string;
  avatar: string;
};

export type MyselfApiErrorAction = {
  error: string;
};

export type UpdateMyself = {};

let initialState = {
  username: '',
  avatar: ''
};

const slice = createSlice({
  name: 'myself',
  initialState,
  reducers: {
    myselfDataReceived: (state, action: PayloadAction<MyselfWithAvatar>) => {
      const { username, avatar } = action.payload;
      state.username = username;
      state.avatar = avatar;
    },
    myselfApiErrorReceived: (
      state,
      action: PayloadAction<MyselfApiErrorAction>
    ) => state,
    myselfUpdate: (state, action: PayloadAction<UpdateMyself>) => state
  }
});

export const updateMyself = () => actions.myselfUpdate({});

export const reducer = slice.reducer;
export const actions = slice.actions;
