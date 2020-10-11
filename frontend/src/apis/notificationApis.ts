import {doDelete, doFetch, doPost} from './api-helper';

export const fetchNotifications = () => {
  return doFetch('/api/notifications')
    .then(res => res)
    .catch(err => {
      throw Error(err.message);
    });
};

export const answerNotification = (notificationId: number, action: string) => {
  const postBody = JSON.stringify({
    action: action
  });

  return doPost(`/api/notifications/${notificationId}/answer`, postBody).catch(
    err => {
      console.log(err);
      throw Error(err.message);
    }
  );
};

export const deleteNotifications = () => {
    return doDelete('/api/notifications')
        .then(res => res)
        .catch(err => {
            throw Error(err.message);
        });
};

export const answerPublicNotification = (id: string, action: string) => {
    const endPoint = `/api/public/notifications/${id}/answer?action=${action}`;
    return doFetch(endPoint)
        .then(res => res)
        .catch(err => {
            throw Error(err.message);
        });
};
