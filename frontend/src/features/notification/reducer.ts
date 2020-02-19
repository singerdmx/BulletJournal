import { createSlice, PayloadAction } from 'redux-starter-kit';

export type NoticeApiErrorAction = {
  error: string;
};

export type UpdateNotifications = {};

export type AnswerNotificationAction = {
  action: string;
  notificationId: number;
};

export interface Originator {
  id: number;
  name: string;
  thumbnail: string;
  avatar: string;
}

export interface Notification {
  id: number;
  title: string;
  content: string;
  timestamp: number;
  originator: Originator;
  actions: Array<string>;
  type: string;
}

export type NotificationsAction = {
  notifications: Array<Notification>;
  etag: string;
};

let initialState = {
  notifications: [] as Array<Notification>,
  etag: ''
};

const slice = createSlice({
  name: 'notice',
  initialState,
  reducers: {
    notificationsReceived: (
      state,
      action: PayloadAction<NotificationsAction>
    ) => {
      const { notifications, etag } = action.payload;
      state.notifications = notifications;
      if (etag && etag.length > 0) {
        state.etag = etag;
      }
    },
    noticeApiErrorReceived: (
      state,
      action: PayloadAction<NoticeApiErrorAction>
    ) => state,
    notificationsUpdate: (state, action: PayloadAction<UpdateNotifications>) =>
      state,
    answerNotice: (state, action: PayloadAction<AnswerNotificationAction>) => state
  }
});

export const reducer = slice.reducer;
export const actions = slice.actions;
