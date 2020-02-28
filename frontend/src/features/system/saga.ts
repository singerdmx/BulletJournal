import { takeLatest, call, all, put } from 'redux-saga/effects';
import { message } from 'antd';
import {
  actions as systemActions,
  SystemApiErrorAction,
  UpdateSystem
} from './reducer';
import { PayloadAction } from 'redux-starter-kit';
import { fetchSystemUpdates } from '../../apis/systemApis';

function* systemApiErrorAction(action: PayloadAction<SystemApiErrorAction>) {
  yield call(message.error, `System Error Received: ${action.payload.error}`);
}

function* SystemUpdate(action: PayloadAction<UpdateSystem>) {
  try {
    const data = yield call(fetchSystemUpdates);
    // console.log(data);
    yield put(
      systemActions.systemUpdateReceived({
        groupsEtag: data.groupsEtag,
        notificationsEtag: data.notificationsEtag,
        ownedProjectsEtag: data.ownedProjectsEtag,
        sharedProjectsEtag: data.sharedProjectsEtag
      })
    );
  } catch (error) {
    yield call(message.error, `System Error Received: ${error}`);
  }
}

export default function* systemSagas() {
  yield all([
    yield takeLatest(
      systemActions.systemApiErrorReceived.type,
      systemApiErrorAction
    ),
    yield takeLatest(systemActions.systemUpdate.type, SystemUpdate)
  ]);
}
