import { actions } from './reducer';

export const googleTokenExpirationTimeUpdate = () => actions.googleTokenExpirationTimeUpdate({});
export const googleCalendarEventListUpdate = (calendarId: string, timezone: string, startDate?: string, endDate?: string) =>
    actions.googleCalendarEventListUpdate({calendarId: calendarId, timezone: timezone, startDate: startDate, endDate: endDate});