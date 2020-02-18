import { takeEvery, call, all, put } from 'redux-saga/effects';
import { message } from 'antd';
import {
  actions as myselfActions,
  MyselfApiErrorAction,
  UpdateMyself
} from './reducer';
import { PayloadAction } from 'redux-starter-kit';
import { fetchMyself } from '../../apis/userApis';

function* myselfApiErrorAction(action: PayloadAction<MyselfApiErrorAction>) {
  yield call(message.error, `Myself Error Received: ${action.payload.error}`);
}

function* myselfUpdate(action: PayloadAction<UpdateMyself>) {
  try {
    const data = yield call(fetchMyself);
    // console.log(data);
    yield put(
      myselfActions.myselfDataReceived({
        username: data.name,
        avatar: data.avatar
      })
    );
  } catch (error) {
    yield call(message.error, `Myself Error Received: ${error}`);
  }
}

export default function* myselfSagas() {
  yield all([
    yield takeEvery(
      myselfActions.myselfApiErrorReceived.type,
      myselfApiErrorAction
    ),
    yield takeEvery(myselfActions.myselfUpdate.type, myselfUpdate)
  ]);
}
