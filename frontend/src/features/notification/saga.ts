import { takeEvery, call, all, put, select } from 'redux-saga/effects';
import { message } from 'antd';
import {
  actions as notificationsActions,
  NoticeApiErrorAction,
  NotificationsAction,
  AnswerNotificationAction,
  Notification
} from './reducer';
import { PayloadAction } from 'redux-starter-kit';
import {
  fetchNotifications,
  answerNotification
} from '../../apis/notificationApis';
import { updateGroups } from '../group/actions';

import { IState } from '../../store';


function* noticeApiErrorReceived(action: PayloadAction<NoticeApiErrorAction>) {
  yield call(message.error, `Notice Error Received: ${action.payload.error}`);
}

function* notificationsUpdate(action: PayloadAction<NotificationsAction>) {
  try {
    const data = yield call(fetchNotifications);
    const etag = data.headers.get("Etag")!;
    const notifications = yield data.json();

    yield put(
      notificationsActions.notificationsReceived({ notifications: notifications, etag: etag })
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
    const notifications = state.notice.notifications.filter((notice: Notification) => notice.id !== notificationId);
    console.log(notifications)
    yield put(
      notificationsActions.notificationsReceived({ notifications: notifications, etag: '' })
    );
    if (type === 'JoinGroupEvent' && action === 'Deline') {
      yield put(updateGroups());
    }
    yield call(message.success, 'User answers notification successful');
  } catch (error) {
    yield call(message.error, `User answers notification failed: ${error}`);
  }
}

export default function* noticeSagas() {
  yield all([
    yield takeEvery(
      notificationsActions.noticeApiErrorReceived.type,
      noticeApiErrorReceived
    ),
    yield takeEvery(
      notificationsActions.notificationsUpdate.type,
      notificationsUpdate
    ),
    yield takeEvery(notificationsActions.answerNotice.type, answerNotice)
  ]);
}
