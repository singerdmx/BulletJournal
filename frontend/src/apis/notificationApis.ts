import { doFetch, doPost } from './api-helper';

export const fetchNotifications = () => {
  return doFetch('/api/notifications')
    .then(res => res.json())
    .catch(err => {
      throw Error(err);
    });
};

export const answerNotification = (notificationId: number, action: string) => {
  const postBody = JSON.stringify({
    action: action
  });

  return doPost(`/api/notifications/${notificationId}/answer`, postBody).catch(
    err => {
      throw Error(err);
    }
  );
};
