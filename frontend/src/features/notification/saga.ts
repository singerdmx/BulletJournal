import { takeEvery, call, all, put } from 'redux-saga/effects';
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

function* noticeApiErrorReceived(action: PayloadAction<NoticeApiErrorAction>) {
  yield call(message.error, `Notice Error Received: ${action.payload.error}`);
}

function* notificationsUpdate(action: PayloadAction<NotificationsAction>) {
  try {
    const data = yield call(fetchNotifications);
    // console.log(data)
    yield put(
      notificationsActions.notificationsReceived({ notifications: data })
    );
  } catch (error) {
    yield call(message.error, `Notice Error Received: ${error}`);
  }
}

function* answerNotice(act: PayloadAction<AnswerNotificationAction>) {
  try {
    const { action, notificationId } = act.payload;
    yield call(answerNotification, notificationId, action);
    yield call(message.success, 'User answers notification successful');
  } catch (error) {
    yield call(message.error, 'User answers notification faild');
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
