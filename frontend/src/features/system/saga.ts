import {all, call, put, takeLatest} from 'redux-saga/effects';
import {message} from 'antd';
import {actions as systemActions, GetPublicProjectItem, SystemApiErrorAction, UpdateSystem} from './reducer';
import {PayloadAction} from 'redux-starter-kit';
import {fetchSystemUpdates, getPublicProjectItem} from '../../apis/systemApis';
import {ContentType} from "../myBuJo/constants";

function* systemApiErrorAction(action: PayloadAction<SystemApiErrorAction>) {
  yield call(message.error, `System Error Received: ${action.payload.error}`);
}

function* SystemUpdate(action: PayloadAction<UpdateSystem>) {
  try {
    const data = yield call(fetchSystemUpdates);
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

function* getPublicItem(action: PayloadAction<GetPublicProjectItem>) {
  try {
    const {itemId} = action.payload;
    const data = yield call(getPublicProjectItem, itemId);
    const type : ContentType = data.contentType;
    const note = type === ContentType.NOTE ? data.projectItem : undefined;
    const task = type === ContentType.TASK ? data.projectItem : undefined;
    yield put(systemActions.publicProjectItemReceived({
      contentType: type, contents: data.contents,
      note: note, task: task
    }));
  } catch (error) {
    yield call(message.error, `getPublicItem Received: ${error}`);
  }
}

export default function* systemSagas() {
  yield all([
    yield takeLatest(
        systemActions.systemApiErrorReceived.type,
        systemApiErrorAction
    ),
    yield takeLatest(systemActions.systemUpdate.type, SystemUpdate),
    yield takeLatest(systemActions.fetchPublicProjectItem.type, getPublicItem)
  ]);
}
