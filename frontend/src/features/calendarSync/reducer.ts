import { createSlice, PayloadAction } from 'redux-starter-kit';
import {CalendarListEntry} from "./interface";

export type ExpirationTimeAction = {
  expirationTime: number;
};

export type CalendarListAction = {
  calendarList: CalendarListEntry[];
};

export type UpdateExpirationTimeAction = {
};

let initialState = {
  googleTokenExpirationTime: 0 as number,
  appleTokenExpirationTime: 0 as number,
  googleCalendarList: [] as CalendarListEntry[]
};

const slice = createSlice({
  name: 'calendarSync',
  initialState,
  reducers: {
    googleTokenExpirationTimeReceived: (state, action: PayloadAction<ExpirationTimeAction>) => {
      const { expirationTime } = action.payload;
      state.googleTokenExpirationTime = expirationTime;
    },
    googleCalendarListReceived: (state, action: PayloadAction<CalendarListAction>) => {
      const { calendarList } = action.payload;
      state.googleCalendarList = calendarList;
    },
    appleTokenExpirationTimeReceived: (state, action: PayloadAction<ExpirationTimeAction>) => {
      const { expirationTime } = action.payload;
      state.appleTokenExpirationTime = expirationTime;
    },
    googleTokenExpirationTimeUpdate: (state, action: PayloadAction<UpdateExpirationTimeAction>) => state,
  }
});

export const reducer = slice.reducer;
export const actions = slice.actions;
