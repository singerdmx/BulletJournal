import { createSlice, PayloadAction } from 'redux-starter-kit';

export type MyselfWithAvatar = {
  username: string;
  avatar: string;
  timezone: string;
  before?: Before;
};

export type MyselfApiErrorAction = {
  error: string;
};

export type UpdateMyself = {};

export type UpdateExpandedMyself = {};

export type PatchMyself = {
  timezone: string;
  before: Before;
};

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
      console.log('inside reducer 40');
      const { username, avatar, timezone, before } = action.payload;
      if (username && username.length > 0) state.username = username;
      if (avatar && avatar.length > 0) state.avatar = avatar;
      if (timezone && timezone.length > 0) state.timezone = timezone;
      if (before) state.before = before;
    },
    myselfApiErrorReceived: (
      state,
      action: PayloadAction<MyselfApiErrorAction>
    ) => state,
    myselfUpdate: (state, action: PayloadAction<UpdateMyself>) => state,
    patchMyself: (state, action: PayloadAction<PatchMyself>) => state,
    expandedMyselfUpdate: (
      state,
      action: PayloadAction<UpdateExpandedMyself>
    ) => state
  }
});

export const reducer = slice.reducer;
export const actions = slice.actions;
