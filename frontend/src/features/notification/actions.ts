import { actions } from './reducer';

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

export const deleteAllNotifications = () => actions.deleteAllNotifications({});
