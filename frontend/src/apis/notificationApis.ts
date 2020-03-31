import { doFetch, doPost } from './api-helper';

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
