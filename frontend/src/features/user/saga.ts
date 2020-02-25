import { takeLatest, call, all, put } from 'redux-saga/effects';
import { message } from 'antd';
import {
  actions as userActions,
  UserApiErrorAction,
  UpdateUser,
  ClearUser
} from './reducer';
import { PayloadAction } from 'redux-starter-kit';
import { fetchUser } from '../../apis/userApis';

function* userApiErrorAction(action: PayloadAction<UserApiErrorAction>) {
  yield call(message.error, `User Error Received: ${action.payload.error}`);
}

function* userUpdate(action: PayloadAction<UpdateUser>) {
  const { name } = action.payload;
  try {
    const data = yield call(fetchUser, name);
    // console.log(data);
    yield put(
      userActions.userDataReceived({
        name: data.name,
        avatar: data.avatar,
        id: data.id,
        thumbnail: data.thumbnail
      })
    );
  } catch (error) {
    yield call(message.error, `User Error Received: ${error}`);
  }
}

export default function* userSagas() {
  yield all([
    yield takeLatest(userActions.userApiErrorReceived.type, userApiErrorAction),
    yield takeLatest(userActions.userUpdate.type, userUpdate)
  ]);
}
