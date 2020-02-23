import { takeLatest, call, all, put, select } from 'redux-saga/effects';
import { message } from 'antd';
import {
  actions as myselfActions,
  MyselfApiErrorAction,
  UpdateMyself,
  PatchMyself,
  UpdateExpandedMyself
} from './reducer';
import { PayloadAction } from 'redux-starter-kit';
import { fetchMyself, patchMyself } from '../../apis/myselfApis';
import { IState } from '../../store';

function* myselfApiErrorAction(action: PayloadAction<MyselfApiErrorAction>) {
  yield call(message.error, `Myself Error Received: ${action.payload.error}`);
}

function* getExpandedMyself(action: PayloadAction<UpdateExpandedMyself>) {
  try {
    const data = yield call(fetchMyself, true);
    yield put(
      myselfActions.myselfDataReceived({
        username: data.name,
        avatar: data.avatar,
        timezone: data.timezone,
        before: data.before
      })
    );
  } catch (error) {
    yield call(message.error, `Myself (Expand) Error Received: ${error}`);
  }
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
    const state: IState = yield select();
    yield call(patchMyself, state.myself.timezone, state.myself.before);
    yield call(message.success, 'User Settings updated successfully');
  } catch (error) {
    yield call(message.error, `Myself Patch Error Received: ${error}`);
  }
}

export default function* myselfSagas() {
  yield all([
    yield takeLatest(
      myselfActions.myselfApiErrorReceived.type,
      myselfApiErrorAction
    ),
    yield takeLatest(myselfActions.myselfUpdate.type, myselfUpdate),
    yield takeLatest(myselfActions.patchMyself.type, myselfPatch),
    yield takeLatest(myselfActions.expandedMyselfUpdate.type, getExpandedMyself)
  ]);
}
