import {all, call, put, select, takeLatest} from 'redux-saga/effects';
import {message} from 'antd';
import {
  actions as notificationsActions,
  AnswerNotificationAction,
  DeleteNotificationsAction,
  NoticeApiErrorAction,
  NotificationsAction,
} from './reducer';
import {PayloadAction} from 'redux-starter-kit';
import {answerNotification, deleteNotifications, fetchNotifications,} from '../../apis/notificationApis';
import {groupUpdate, updateGroups} from '../group/actions';
import {Notification} from './interface';
import {IState} from '../../store';
import {EventType} from './constants';
import {actions as SystemActions} from '../system/reducer';
import {reloadReceived} from "../myself/actions";

function* noticeApiErrorReceived(action: PayloadAction<NoticeApiErrorAction>) {
  yield call(message.error, `Notice Error Received: ${action.payload.error}`);
}

function* notificationsUpdate(action: PayloadAction<NotificationsAction>) {
  try {
    const data = yield call(fetchNotifications);
    const etag = data.headers.get('Etag')!;
    const notifications: Notification[] = yield data.json();

    const state: IState = yield select();
    const systemState = state.system;

    if (
        etag &&
        state.system.notificationsEtag &&
        state.system.notificationsEtag !== etag &&
        notifications.filter(n => n.timestamp > (Date.now() - 120000)).length > 0
    ) {
      // if latestNotification is within 2 minutes
      yield call(message.info, "You've got new notifications");
    }

    yield put(
        SystemActions.systemUpdateReceived({
          ...systemState,
          notificationsEtag: etag,
        })
    );
    yield put(
        notificationsActions.notificationsReceived({
          notifications: notifications,
        })
    );
  } catch (error) {
    if (error.message === 'reload') {
      yield put(reloadReceived(true));
    } else {
      yield call(message.error, `Notice Error Received: ${error}`);
    }
  }
}

function* answerNotice(act: PayloadAction<AnswerNotificationAction>) {
  const {action, notificationId, type} = act.payload;

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
    if (error.message === 'reload') {
      yield put(reloadReceived(true));
    } else if (error.message === '404') {
      yield call(message.error, 'The notification is no longer valid');
    } else {
      yield call(message.error, `User answers notification failed: ${error}`);
    }
  }
  const state: IState = yield select();
  const notifications = state.notice.notifications.filter(
      (notice: Notification) => notice.id !== notificationId
  );
  yield put(
      notificationsActions.notificationsReceived({notifications: notifications})
  );
}

function* notificationsDelete(action: PayloadAction<DeleteNotificationsAction>) {
  try {
    const data = yield call(deleteNotifications);
    const etag = data.headers.get('Etag')!;
    const notifications: Notification[] = yield data.json();

    const state: IState = yield select();
    const systemState = state.system;

    yield put(
        SystemActions.systemUpdateReceived({
          ...systemState,
          notificationsEtag: etag,
        })
    );
    yield put(
        notificationsActions.notificationsReceived({
          notifications: notifications,
        })
    );
  } catch (error) {
    if (error.message === 'reload') {
      yield put(reloadReceived(true));
    } else {
      yield call(message.error, `Delete all notification failed: ${error}`);
    }
  }
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
    yield takeLatest(
        notificationsActions.deleteAllNotifications.type,
        notificationsDelete
    ),
    yield takeLatest(notificationsActions.answerNotice.type, answerNotice),
  ]);
}
