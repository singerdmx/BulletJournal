import { takeLatest, call, all, put } from 'redux-saga/effects';
import { message } from 'antd';
import {
  actions as myselfActions,
  MyselfApiErrorAction,
  UpdateMyself,
  PatchMyself,
  UpdateExpandedMyself
} from './reducer';
import { actions as settingsActions } from '../../components/settings/reducer';
import { PayloadAction } from 'redux-starter-kit';
import { fetchMyself, patchMyself } from '../../apis/myselfApis';

function* myselfApiErrorAction(action: PayloadAction<MyselfApiErrorAction>) {
  yield call(message.error, `Myself Error Received: ${action.payload.error}`);
}

function* getExpandedMyself(action: PayloadAction<UpdateExpandedMyself>) {
  try {
    const { updateSettings } = action.payload;

    const data = yield call(fetchMyself, true);
    yield put(
      myselfActions.myselfDataReceived({
        username: data.name,
        avatar: data.avatar,
        timezone: data.timezone,
        before: data.reminderBeforeTask
      })
    );
    if (updateSettings) {
      yield put(settingsActions.updateTimezone({ timezone: data.timezone }));
      yield put(
        settingsActions.updateBefore({ before: data.reminderBeforeTask })
      );
    }
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
        avatar: data.avatar
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
    yield put(
      myselfActions.myselfDataReceived({
        timezone: timezone,
        before: before
      })
    );
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
