import { takeEvery, call, all, put } from 'redux-saga/effects';
import { message } from 'antd';
import {
  actions as projectActions,
  ProjectApiErrorAction,
  UpdateProjects
} from './reducer';
import { PayloadAction } from 'redux-starter-kit';
import { fetchProjects } from '../../apis/projectApis';

function* projectApiErrorAction(action: PayloadAction<ProjectApiErrorAction>) {
  yield call(message.error, `Project Error Received: ${action.payload.error}`);
}

function* projectsUpdate(action: PayloadAction<UpdateProjects>) {
  try {
    const data = yield call(fetchProjects);
    // console.log(data);
    yield put(
      projectActions.projectsReceived({
        owned: data.owned,
        shared: data.shared
      })
    );
  } catch (error) {
    yield call(message.error, `Project Error Received: ${error}`);
  }
}

export default function* projectSagas() {
  yield all([
    yield takeEvery(
      projectActions.projectsApiErrorReceived.type,
      projectApiErrorAction
    ),
    yield takeEvery(projectActions.projectsUpdate.type, projectsUpdate)
  ]);
}
