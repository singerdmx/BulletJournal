import { takeEvery, call, all, put } from 'redux-saga/effects';
import { toast } from 'react-toastify';
import { actions as userActions, ApiErrorAction, UpdateUserInfo } from './reducer';
import { PayloadAction } from 'redux-starter-kit';
import { fetchUserInfo } from '../../apis/userApis'

function* apiErrorReceived(action: PayloadAction<ApiErrorAction>) {
    yield call(toast.error, `Error Received: ${action.payload.error}`);
}

function* userInfoUpdate(action: PayloadAction<UpdateUserInfo>){
    try {
        const data =  yield call(fetchUserInfo);
        yield put(userActions.UserDataReceived({username: "fdfdf", avatar: "fdfdfd"}))
    } catch(error) {
        yield call(toast.error, `Error Received: ${error}`)
    }
}

export default function* userSagas() {
    yield all([
        yield takeEvery(userActions.userApiErrorReceived.type, apiErrorReceived),
        yield takeEvery(userActions.UserInfoUpdate.type, userInfoUpdate)
    ])
}

