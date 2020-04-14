import { doPost } from './api-helper';

export const loginGoogleCalendar = () => {
    return doPost('/api/calendar/google/login');
};