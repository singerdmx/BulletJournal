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

export type DeleteNotificationsAction = {
};

let initialState = {
  notifications: [] as Array<Notification>,
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
    noticeApiErrorReceived: (
      state,
      action: PayloadAction<NoticeApiErrorAction>
    ) => state,
    notificationsUpdate: (state, action: PayloadAction<UpdateNotifications>) =>
      state,
    answerNotice: (state, action: PayloadAction<AnswerNotificationAction>) =>
      state,
    deleteAllNotifications: (state, action: PayloadAction<DeleteNotificationsAction>) =>
        state,
  },
});

export const reducer = slice.reducer;
export const actions = slice.actions;
