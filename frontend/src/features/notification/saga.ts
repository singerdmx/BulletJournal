import { takeLatest, call, all, put, select } from 'redux-saga/effects';
import { message } from 'antd';
import {
  actions as notificationsActions,
  NoticeApiErrorAction,
  NotificationsAction,
  AnswerNotificationAction
} from './reducer';
import { PayloadAction } from 'redux-starter-kit';
import {
  fetchNotifications,
  answerNotification
} from '../../apis/notificationApis';
import { updateGroups, groupUpdate } from '../group/actions';

import { Notification } from './interface';

import { IState } from '../../store';

function* noticeApiErrorReceived(action: PayloadAction<NoticeApiErrorAction>) {
  yield call(message.error, `Notice Error Received: ${action.payload.error}`);
}

function* notificationsUpdate(action: PayloadAction<NotificationsAction>) {
  try {
    const data = yield call(fetchNotifications);
    const etag = data.headers.get('Etag')!;
    const notifications = yield data.json();

    yield put(
      notificationsActions.notificationsReceived({
        notifications: notifications,
        etag: etag
      })
    );
  } catch (error) {
    yield call(message.error, `Notice Error Received: ${error}`);
  }
}

function* answerNotice(act: PayloadAction<AnswerNotificationAction>) {
  try {
    const { action, notificationId, type } = act.payload;
    yield call(answerNotification, notificationId, action);
    const state: IState = yield select();
    const notifications = state.notice.notifications.filter(
      (notice: Notification) => notice.id !== notificationId
    );
    console.log(notifications);
    yield put(
      notificationsActions.notificationsReceived({
        notifications: notifications,
        etag: ''
      })
    );
    console.log(type);
    if (type.toLowerCase().includes('group')) {
      yield all([
        put(updateGroups()),
        put(groupUpdate()),
      ]);
    }
    yield call(message.success, 'User answers notification successful');
  } catch (error) {
    yield call(message.error, `User answers notification failed: ${error}`);
  }
}

export default function* noticeSagas() {
  yield all([
    yield takeLatest(
      notificationsActions.noticeApiErrorReceived.type,
      noticeApiErrorReceived
    ),
    yield takeLatest(
      notificationsActions.notificationsUpdate.type,
      notificationsUpdate
    ),
    yield takeLatest(notificationsActions.answerNotice.type, answerNotice)
  ]);
}
