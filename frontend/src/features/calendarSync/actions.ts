import { actions } from './reducer';
import { GoogleCalendarEvent } from './interface';

export const googleTokenExpirationTimeUpdate = () =>
  actions.googleTokenExpirationTimeUpdate({});
export const googleCalendarEventListUpdate = (
  calendarId: string,
  timezone: string,
  startDate?: string,
  endDate?: string
) =>
  actions.googleCalendarEventListUpdate({
    calendarId: calendarId,
    timezone: timezone,
    startDate: startDate,
    endDate: endDate,
  });
export const googleCalendarCreateEvents = (
  projectId: number,
  events: GoogleCalendarEvent[]
) =>
  actions.googleCalendarCreateEvents({ projectId: projectId, events: events });
export const updateWatchedProject = (calendarId: string) =>
  actions.watchedProjectUpdate({ calendarId: calendarId });
export const watchCalendar = (calendarId: string, projectId: number) =>
  actions.watchCalendar({ calendarId: calendarId, projectId: projectId });
export const unwatchCalendar = (calendarId: string) =>
  actions.unwatchCalendar({ calendarId: calendarId });
export const googleCalendarEventListReceived = (
  googleCalendarEventList: GoogleCalendarEvent[]
) =>
  actions.googleCalendarEventListReceived({
    googleCalendarEventList: googleCalendarEventList,
  });

export const importEventsToProject = (eventList: string[], projectId: number) =>
  actions.importEventsToProject({ eventList: eventList, projectId: projectId });

export const updateSyncing = (syncing: boolean) => {
  actions.updateSyncing({ syncing: syncing });
};
