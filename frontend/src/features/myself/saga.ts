import { takeEvery, call, all, put } from 'redux-saga/effects';
import { message } from 'antd';
import {
  actions as myselfActions,
  MyselfApiErrorAction,
  UpdateMyself,
  PatchMyself
} from './reducer';
import { PayloadAction } from 'redux-starter-kit';
import { fetchMyself, patchMyself } from '../../apis/myselfApis';

function* myselfApiErrorAction(action: PayloadAction<MyselfApiErrorAction>) {
  yield call(message.error, `Myself Error Received: ${action.payload.error}`);
}

function* myselfUpdate(action: PayloadAction<UpdateMyself>) {
  try {
    const data = yield call(fetchMyself);
    yield put(
      myselfActions.myselfDataReceived({
        username: data.name,
        avatar: data.avatar,
        timezone: data.timezone,
        before: data.before
      })
    );
  } catch (error) {
    yield call(message.error, `Myself Error Received: ${error}`);
  }
}

function* myselfPatch(action: PayloadAction<PatchMyself>) {
  try {
    const { timezone, before } = action.payload;
    yield call(patchMyself, timezone, before);
  } catch (error) {
    yield call(message.error, `Myself Patch Error Received: ${error}`);
  }
}

export default function* myselfSagas() {
  yield all([
    yield takeEvery(
      myselfActions.myselfApiErrorReceived.type,
      myselfApiErrorAction
    ),
    yield takeEvery(myselfActions.myselfUpdate.type, myselfUpdate),
    yield takeEvery(myselfActions.patchMyself.type, myselfPatch)
  ]);
}
