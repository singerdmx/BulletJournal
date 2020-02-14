import {takeEvery, call, all, put} from 'redux-saga/effects';
import {toast} from 'react-toastify';
import {
    actions as notificationsActions,
    ApiErrorAction, NotificationsAction
} from './reducer';
import {PayloadAction} from 'redux-starter-kit';
import {fetchUserInfo} from '../../apis/userApis';

function* apiErrorReceived(action: PayloadAction<ApiErrorAction>) {
    yield call(toast.error, `Error Received: ${action.payload.error}`);
}

function* notificationsUpdate(action: PayloadAction<NotificationsAction>) {
    try {
        const data = yield call(fetchUserInfo);
        yield put(
            notificationsActions.notificationsReceived(data.notifications)
        );
    } catch (error) {
        yield call(toast.error, `Error Received: ${error}`);
    }
}

export default function* userSagas() {
    yield all([
        yield takeEvery(notificationsActions.notificationsReceived.type, apiErrorReceived),
        yield takeEvery(notificationsActions.notificationsUpdate.type, notificationsUpdate)
    ]);
}
