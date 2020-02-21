import { createSlice, PayloadAction } from 'redux-starter-kit';

export type MyselfWithAvatar = {
  username: string;
  avatar: string;
  timezone: string;
  before: Before;
};

export type MyselfApiErrorAction = {
  error: string;
};

export type UpdateMyself = {};

export type Before = {
  text: string;
  value: number;
};

let initialState = {
  username: '',
  avatar: '',
  timezone: '',
  before: {} as Before
};

const slice = createSlice({
  name: 'myself',
  initialState,
  reducers: {
    myselfDataReceived: (state, action: PayloadAction<MyselfWithAvatar>) => {
      const { username, avatar, timezone, before } = action.payload;
      state.username = username;
      state.avatar = avatar;
      if (timezone && timezone.length > 0) state.timezone = timezone;
      if (before) state.before = before;
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
