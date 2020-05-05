import { createSlice, PayloadAction } from 'redux-starter-kit';
import { Notification } from './interface';

export type NoticeApiErrorAction = {
  error: string;
};

export type UpdateNotifications = {};

export type AnswerNotificationAction = {
  action: string;
  notificationId: number;
  type: string;
};

export type NotificationsAction = {
  notifications: Array<Notification>;
};

export type LatestNotificationsAction = {
  latestNotifaction: Notification | undefined;
};

let initialState = {
  notifications: [] as Array<Notification>,
  latestNotification: undefined as Notification | undefined,
};

const slice = createSlice({
  name: 'notice',
  initialState,
  reducers: {
    notificationsReceived: (
      state,
      action: PayloadAction<NotificationsAction>
    ) => {
      const { notifications } = action.payload;
      state.notifications = notifications;
    },
    latestNotificationReceived: (
      state,
      action: PayloadAction<LatestNotificationsAction>
    ) => {
      const { latestNotifaction } = action.payload;
      state.latestNotification = latestNotifaction;
    },
    noticeApiErrorReceived: (
      state,
      action: PayloadAction<NoticeApiErrorAction>
    ) => state,
    notificationsUpdate: (state, action: PayloadAction<UpdateNotifications>) =>
      state,
    answerNotice: (state, action: PayloadAction<AnswerNotificationAction>) =>
      state,
  },
});

export const reducer = slice.reducer;
export const actions = slice.actions;
