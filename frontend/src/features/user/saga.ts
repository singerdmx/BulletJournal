import { takeLatest, call, all, put } from 'redux-saga/effects';
import { message } from 'antd';
import {
  actions as userActions,
  UserApiErrorAction,
  UpdateUser, ChangeAlias
} from './reducer';
import { PayloadAction } from 'redux-starter-kit';
import {changeUserAlias, fetchUser} from '../../apis/userApis';

function* userApiErrorAction(action: PayloadAction<UserApiErrorAction>) {
  yield call(message.error, `${action.payload.error}`);
}

function* userUpdate(action: PayloadAction<UpdateUser>) {
  const { name } = action.payload;
  try {
    const data = yield call(fetchUser, name);
    yield put(
      userActions.userDataReceived({
        name: data.name,
        avatar: data.avatar,
        id: data.id,
        thumbnail: data.thumbnail
      })
    );
  } catch (error) {
    yield put(userActions.userClear({}));
    yield call(message.error, `User ${name} Not Found`);
  }
}

function* changeAlias(action: PayloadAction<ChangeAlias>) {
  const { targetUser, alias } = action.payload;
  try {
    yield call(changeUserAlias, targetUser, alias);
  } catch (error) {
    yield call(message.error, `changeAlias Fail: ${error}`);
  }
}

export default function* userSagas() {
  yield all([
    yield takeLatest(userActions.userApiErrorReceived.type, userApiErrorAction),
    yield takeLatest(userActions.userUpdate.type, userUpdate),
    yield takeLatest(userActions.userAliasUpdate.type, changeAlias)
  ]);
}
