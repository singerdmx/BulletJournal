import { doFetch, doPost } from './api-helper';
import { GoogleCalendarEvent } from '../features/calendarSync/interface';

export const loginGoogleCalendar = () => {
  return doPost('/api/calendar/google/login');
};

export const logoutGoogleCalendar = () => {
  return doPost('/api/calendar/google/logout');
};

export const getGoogleCalendarLoginStatus = () => {
  return doFetch('/api/calendar/google/loginStatus')
    .then((res) => res.json())
    .catch((err) => {
      throw Error(err.message);
    });
};

export const getGoogleCalendarList = () => {
  return doFetch('/api/calendar/google/calendarList')
    .then((res) => res.json())
    .catch((err) => {
      throw Error(err.message);
    });
};

export const getGoogleCalendarEventList = (
  calendarId: string,
  timezone: string,
  startDate?: string,
  endDate?: string
) => {
  let endpoint = `/api/calendar/google/calendars/${encodeURIComponent(
    calendarId
  )}/eventList?timezone=${encodeURIComponent(timezone)}`;
  if (startDate) {
    endpoint += `&startDate=${startDate}`;
  }
  if (endDate) {
    endpoint += `&endDate=${endDate}`;
  }
  return doFetch(endpoint)
    .then((res) => res.json())
    .catch((err) => {
      throw Error(err.message);
    });
};

export const createGoogleCalendarEvents = (
  projectId: number,
  events: GoogleCalendarEvent[]
) => {
  const postBody = JSON.stringify({
    projectId: projectId,
    events: events,
  });
  return doPost('/api/calendar/google/events', postBody)
    .then((res) => res)
    .catch((err) => {
      throw Error(err.message);
    });
};

export const getWatchedProject = (calendarId: string) => {
  return doFetch(
    `/api/calendar/google/calendars/${encodeURIComponent(
      calendarId
    )}/watchedProject`
  )
    .then((res) => res.json())
    .catch((err) => {
      throw Error(err.message);
    });
};

export const getWatchedProjects = () => {
  return doFetch(
    '/api/calendar/google/calendars/watchedProjects'
  )
    .then((res) => res.json())
    .catch((err) => {
      throw Error(err.message);
    });
};

export const watchCalendar = (calendarId: string, projectId: number) => {
  const postBody = JSON.stringify({
    projectId: projectId,
  });
  return doPost(
    `/api/calendar/google/calendars/${encodeURIComponent(calendarId)}/watch`,
    postBody
  )
    .then((res) => res.json())
    .catch((err) => {
      throw Error(err.message);
    });
};

export const unwatchCalendar = (calendarId: string) => {
  return doPost(
    `/api/calendar/google/calendars/${encodeURIComponent(calendarId)}/unwatch`
  )
    .then((res) => res)
    .catch((err) => {
      throw Error(err.message);
    });
};

export const importEventsToProject = (
  projectId: number,
  events: GoogleCalendarEvent[]
) => {
  const postBody = JSON.stringify({
    projectId: projectId,
    events: events,
  });
  return doPost(`/api/calendar/google/events`, postBody)
    .then((res) => res)
    .catch((err) => {
      throw Error(err.message);
    });
};
