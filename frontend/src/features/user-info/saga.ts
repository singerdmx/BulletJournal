import { takeEvery, call, all, put } from 'redux-saga/effects';
import { toast } from 'react-toastify';
import { actions as userActions, UserApiErrorAction, UpdateUserInfo } from './reducer';
import { PayloadAction } from 'redux-starter-kit';
import { fetchUserInfo } from '../../apis/userApis'

function* userApiErrorAction(action: PayloadAction<UserApiErrorAction>) {
    yield call(toast.error, `Error Received: ${action.payload.error}`);
}

function* userInfoUpdate(action: PayloadAction<UpdateUserInfo>){
    try {
        const data =  yield call(fetchUserInfo);
        // console.log(data);
        yield put(userActions.UserDataReceived({username: data.name, avatar: data.avatar}))
    } catch(error) {
        yield call(toast.error, `Error Received: ${error}`)
    }
}

export default function* userSagas() {
    yield all([
        yield takeEvery(userActions.UserApiErrorReceived.type, userApiErrorAction),
        yield takeEvery(userActions.UserInfoUpdate.type, userInfoUpdate)
    ])
}

