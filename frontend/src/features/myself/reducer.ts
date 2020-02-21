import { createSlice, PayloadAction } from 'redux-starter-kit';

export type MyselfWithAvatar = {
  username: string;
  avatar: string;
  timezone: string;
};

export type MyselfApiErrorAction = {
  error: string;
};

export type UpdateMyself = {};

let initialState = {
  username: '',
  avatar: '',
  timezone: ''
};

const slice = createSlice({
  name: 'myself',
  initialState,
  reducers: {
    myselfDataReceived: (state, action: PayloadAction<MyselfWithAvatar>) => {
      const { username, avatar, timezone } = action.payload;
      state.username = username;
      state.avatar = avatar;
      if (timezone && timezone.length > 0) state.timezone = timezone;
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
