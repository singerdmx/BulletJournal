import { createSlice, PayloadAction } from 'redux-starter-kit';
import {CalendarListEntry, GoogleCalendarEvent} from "./interface";
import {Project} from "../project/interface";

export type ExpirationTimeAction = {
  expirationTime: number;
};

export type UpdateGoogleCalendarEventListAction = {
  calendarId: string;
  timezone: string;
  startDate?: string;
  endDate?: string;
}

export type GoogleCalendarCreateEventsAction = {
  projectId: number,
  events: GoogleCalendarEvent[]
}

export type UpdateWatchedProjectAction = {
  calendarId: string;
}

export type WatchedCalendarAction = {
  calendarId: string;
  projectId: number;
}

export type UnwatchedCalendarAction = {
  calendarId: string;
}

export type CalendarListAction = {
  calendarList: CalendarListEntry[];
};

export type CalendarEventListAction = {
  googleCalendarEventList: GoogleCalendarEvent[];
};

export type WatchedProjectAction = {
  project: Project | undefined;
}

export type UpdateExpirationTimeAction = {
};

let initialState = {
  googleTokenExpirationTime: 0 as number,
  appleTokenExpirationTime: 0 as number,
  googleCalendarList: [] as CalendarListEntry[],
  googleCalendarEventList: [] as GoogleCalendarEvent[],
  watchedProject: undefined as Project | undefined
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
    watchedProjectReceived: (state, action: PayloadAction<WatchedProjectAction>) => {
      const { project } = action.payload;
      state.watchedProject = project;
    },
    appleTokenExpirationTimeReceived: (state, action: PayloadAction<ExpirationTimeAction>) => {
      const { expirationTime } = action.payload;
      state.appleTokenExpirationTime = expirationTime;
    },
    googleTokenExpirationTimeUpdate: (state, action: PayloadAction<UpdateExpirationTimeAction>) => state,
    googleCalendarEventListUpdate: (state, action: PayloadAction<UpdateGoogleCalendarEventListAction>) => state,
    googleCalendarCreateEvents: (state, action: PayloadAction<GoogleCalendarCreateEventsAction>) => state,
    watchedProjectUpdate: (state, action: PayloadAction<UpdateWatchedProjectAction>) => state,
    watchCalendar: (state, action: PayloadAction<WatchedCalendarAction>) => state,
    unwatchCalendar: (state, action: PayloadAction<UnwatchedCalendarAction>) => state,
  }
});

export const reducer = slice.reducer;
export const actions = slice.actions;
