import {doFetch, doPost} from './api-helper';

export const loginGoogleCalendar = () => {
    return doPost('/api/calendar/google/login');
};

export const logoutGoogleCalendar = () => {
    return doPost('/api/calendar/google/logout');
};

export const getGoogleCalendarLoginStatus = () => {
    return doFetch('/api/calendar/google/loginStatus')
        .then(res => res.json())
        .catch(err => {
            throw Error(err.message);
        });
};

export const getGoogleCalendarList = () => {
    return doFetch('/api/calendar/google/calendarList')
        .then(res => res.json())
        .catch(err => {
            throw Error(err.message);
        });
};

export const getGoogleCalendarEventList = (calendarId: string, timezone: string, startDate?: string, endDate?: string) => {
    let endpoint = `/api/calendar/google/calendars/${calendarId}/eventList?timezone=${timezone}`;
    if (startDate) {
        endpoint += `&startDate=${startDate}`;
    }
    if (endDate) {
        endpoint += `&startDate=${endDate}`;
    }
    return doFetch(endpoint)
        .then(res => res.json())
        .catch(err => {
            throw Error(err.message);
        });
};