import { actions } from './reducer';
export const updateNotifications = () => actions.notificationsUpdate({});
export const answerNotice = (action: string, notificationId: number) =>
  actions.answerNotice({ action: action, notificationId: notificationId });
