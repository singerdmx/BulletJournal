import { takeEvery, call, all, put } from 'redux-saga/effects';
import { message } from 'antd';
import { actions as userActions, UserApiErrorAction, UpdateUserInfo } from './reducer';
import { PayloadAction } from 'redux-starter-kit';
import { fetchUserInfo } from '../../apis/userApis'

function* userApiErrorAction(action: PayloadAction<UserApiErrorAction>) {
    yield call(message.error, `Notice Error Received: ${action.payload.error}`);
}

function* userInfoUpdate(action: PayloadAction<UpdateUserInfo>){
    try {
        const data =  yield call(fetchUserInfo);
        // console.log(data);
        yield put(userActions.UserDataReceived({username: data.name, avatar: data.avatar}))
    } catch(error) {
        yield call(message.error, `User Error Received: ${error}`)
    }
}

export default function* userSagas() {
    yield all([
        yield takeEvery(userActions.UserApiErrorReceived.type, userApiErrorAction),
        yield takeEvery(userActions.UserInfoUpdate.type, userInfoUpdate)
    ])
}

