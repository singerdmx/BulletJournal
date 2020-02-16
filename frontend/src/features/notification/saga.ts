import { takeEvery, call, all, put } from 'redux-saga/effects';
import { toast } from 'react-toastify';
import {
  actions as notificationsActions,
  NoticeApiErrorAction,
  NotificationsAction,
  Originator,
  Notification
} from './reducer';
import { PayloadAction } from 'redux-starter-kit';
import { fetchNotifications } from '../../apis/notificationApis';

function* noticeApiErrorReceived(action: PayloadAction<NoticeApiErrorAction>) {
  yield call(toast.error, `Error Received: ${action.payload.error}`);
}

function* notificationsUpdate(action: PayloadAction<NotificationsAction>) {
  try {
    const data = yield call(fetchNotifications);
    // console.log(data)
    yield put(notificationsActions.notificationsReceived({ notifications: data}))
  } catch (error) {
    yield call(toast.error, `Error Received: ${error}`);
  }
}

export default function* userSagas() {
  yield all([
    yield takeEvery(
      notificationsActions.noticeApiErrorReceived.type,
      noticeApiErrorReceived
    ),
    yield takeEvery(
      notificationsActions.notificationsUpdate.type,
      notificationsUpdate
    )
  ]);
}
