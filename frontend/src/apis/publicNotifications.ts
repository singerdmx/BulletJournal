import {doFetch} from './api-helper';

export const answerPublicNotification = (id: string, action: string) => {
    const endPoint = `/api/public/notifications/${id}/answer?action=${action}`;
    return doFetch(endPoint)
        .then(res => res)
        .catch(err => {
            throw Error(err.message);
        });
};