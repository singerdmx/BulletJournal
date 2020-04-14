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