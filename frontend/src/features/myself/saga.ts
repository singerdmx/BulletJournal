import { takeLatest, call, all, put, select } from 'redux-saga/effects';
import { message } from 'antd';
import {
  actions as myselfActions,
  MyselfApiErrorAction,
  UpdateMyself,
  PatchMyself,
  UpdateExpandedMyself
} from './reducer';
import { IState } from '../../store';
import { actions as settingsActions } from '../../components/settings/reducer';
import { updateMyBuJoDates } from '../../features/myBuJo/actions';
import { PayloadAction } from 'redux-starter-kit';
import { fetchMyself, patchMyself } from '../../apis/myselfApis';

function* myselfApiErrorAction(action: PayloadAction<MyselfApiErrorAction>) {
  yield call(message.error, `Myself Error Received: ${action.payload.error}`);
}

function* getExpandedMyself(action: PayloadAction<UpdateExpandedMyself>) {
  try {
    const { updateSettings } = action.payload;

    const data = yield call(fetchMyself, true);
    let currentTime = new Date().toLocaleString('en-US', {
      timeZone: data.timezone
    });

    yield put(
      myselfActions.myselfDataReceived({
        username: data.name,
        avatar: data.avatar,
        timezone: data.timezone,
        before: data.reminderBeforeTask,
        currency: data.currency
      })
    );
    const state: IState = yield select();
    if (!state.myBuJo.startDate) {
      yield put(updateMyBuJoDates(currentTime, currentTime));
    }

    if (updateSettings) {
      yield put(settingsActions.updateTimezone({ timezone: data.timezone }));
      yield put(
        settingsActions.updateBefore({ before: data.reminderBeforeTask })
      );
      yield put(settingsActions.updateCurrency({ currency: data.currency }));
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
    const { timezone, before, currency } = action.payload;
    yield call(patchMyself, timezone, before, currency);
    let currentTime = new Date().toLocaleString('en-US', {
      timeZone: timezone
    });
    yield put(
      myselfActions.myselfDataReceived({
        timezone: timezone,
        before: before,
        currency: currency
      })
    );
    yield put(updateMyBuJoDates(currentTime, currentTime));
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
