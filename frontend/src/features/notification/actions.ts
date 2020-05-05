import { actions } from './reducer';
import { Notification } from './interface';

export const updateNotifications = () => actions.notificationsUpdate({});
export const answerNotice = (
  action: string,
  notificationId: number,
  type: string
) =>
  actions.answerNotice({
    action: action,
    notificationId: notificationId,
    type: type,
  });
export const updateLatestNotification = (
  latestNotifaction: Notification | undefined
) =>
  actions.latestNotificationReceived({ latestNotifaction: latestNotifaction });
