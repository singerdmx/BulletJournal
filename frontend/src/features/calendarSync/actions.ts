import { actions } from './reducer';
import {GoogleCalendarEvent} from "./interface";

export const googleTokenExpirationTimeUpdate = () => actions.googleTokenExpirationTimeUpdate({});
export const googleCalendarEventListUpdate = (calendarId: string, timezone: string, startDate?: string, endDate?: string) =>
    actions.googleCalendarEventListUpdate({calendarId: calendarId, timezone: timezone, startDate: startDate, endDate: endDate});
export const googleCalendarCreateEvents = (projectId: number, events: GoogleCalendarEvent[]) =>
    actions.googleCalendarCreateEvents({projectId: projectId, events: events});
export const updateWatchedProject = (calendarId: string) =>
    actions.watchedProjectUpdate({calendarId: calendarId});