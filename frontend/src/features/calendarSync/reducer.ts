import { createSlice, PayloadAction } from 'redux-starter-kit';

export type ExpirationTimeAction = {
  expirationTime: number;
};

export type UpdateExpirationTimeAction = {
};

let initialState = {
  googleTokenExpirationTime: 0 as number,
  appleTokenExpirationTime: 0 as number,
};

const slice = createSlice({
  name: 'calendarSync',
  initialState,
  reducers: {
    googleTokenExpirationTimeReceived: (state, action: PayloadAction<ExpirationTimeAction>) => {
      const { expirationTime } = action.payload;
      state.googleTokenExpirationTime = expirationTime;
    },
    appleTokenExpirationTimeReceived: (state, action: PayloadAction<ExpirationTimeAction>) => {
      const { expirationTime } = action.payload;
      state.googleTokenExpirationTime = expirationTime;
    },
    googleTokenExpirationTimeUpdate: (state, action: PayloadAction<UpdateExpirationTimeAction>) => state,
  }
});

export const reducer = slice.reducer;
export const actions = slice.actions;
