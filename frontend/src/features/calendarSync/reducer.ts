import { createSlice, PayloadAction } from 'redux-starter-kit';
import {CalendarListEntry, GoogleCalendarEvent} from "./interface";

export type ExpirationTimeAction = {
  expirationTime: number;
};

export type UpdateGoogleCalendarEventListAction = {
  calendarId: string;
  timezone: string;
  startDate?: string;
  endDate?: string;
}

export type CalendarListAction = {
  calendarList: CalendarListEntry[];
};

export type CalendarEventListAction = {
  googleCalendarEventList: GoogleCalendarEvent[];
};

export type UpdateExpirationTimeAction = {
};

let initialState = {
  googleTokenExpirationTime: 0 as number,
  appleTokenExpirationTime: 0 as number,
  googleCalendarList: [] as CalendarListEntry[],
  googleCalendarEventList: [] as GoogleCalendarEvent[],
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
    googleCalendarEventListReceived: (state, action: PayloadAction<CalendarEventListAction>) => {
      const { googleCalendarEventList } = action.payload;
      state.googleCalendarEventList = googleCalendarEventList;
    },
    appleTokenExpirationTimeReceived: (state, action: PayloadAction<ExpirationTimeAction>) => {
      const { expirationTime } = action.payload;
      state.appleTokenExpirationTime = expirationTime;
    },
    googleTokenExpirationTimeUpdate: (state, action: PayloadAction<UpdateExpirationTimeAction>) => state,
    googleCalendarEventListUpdate: (state, action: PayloadAction<UpdateGoogleCalendarEventListAction>) => state,
  }
});

export const reducer = slice.reducer;
export const actions = slice.actions;
