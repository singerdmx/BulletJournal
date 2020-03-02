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
import { EventType } from './constants';
import { fetchSystemUpdates } from '../../apis/systemApis';

function* noticeApiErrorReceived(action: PayloadAction<NoticeApiErrorAction>) {
  yield call(message.error, `Notice Error Received: ${action.payload.error}`);
}

function* notificationsUpdate(action: PayloadAction<NotificationsAction>) {
  try {
    const data = yield call(fetchNotifications);
    const etag = data.headers.get('Etag')!;
    const notifications = yield data.json();

    const state: IState = yield select();

    if (etag && state.notice.etag && state.notice.etag != etag) {
      navigator.serviceWorker
        .getRegistration()
        .then(reg => reg?.showNotification("You've got new notifications"));
    }

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
  const { action, notificationId, type } = act.payload;
  console.log(type);

  try {
    yield call(answerNotification, notificationId, action);
    if (type.toLowerCase().includes('group')) {
      yield put(updateGroups());
      if (
        type !== EventType.DeleteGroupEvent &&
        type !== EventType.RemoveUserFromGroupEvent
      ) {
        yield put(groupUpdate());
      }
    }
  } catch (error) {
    console.log(error);
    if (error.message === '404') {
      yield call(message.error, 'The notification is no longer valid');
    } else {
      yield call(message.error, `User answers notification failed: ${error}`);
    }
  }
  const state: IState = yield select();
  const notifications = state.notice.notifications.filter(
    (notice: Notification) => notice.id !== notificationId
  );
  const data = yield call(fetchSystemUpdates, 'notificationsEtag');
  yield put(
    notificationsActions.notificationsReceived({
      notifications: notifications,
      etag: data.notificationsEtag
    })
  );
}

export default function* notificationSagas() {
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
