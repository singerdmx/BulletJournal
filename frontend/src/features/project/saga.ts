import { takeEvery, call, all, put } from 'redux-saga/effects';
import { message } from 'antd';
import {
  actions as projectActions,
  ProjectApiErrorAction,
  UpdateProjects,
  ProjectCreateAction,
  GetProjectAction,
  UpdateSharedProjectsOrderAction
} from './reducer';
import { PayloadAction } from 'redux-starter-kit';
import {
  fetchProjects,
  createProject,
  getProject,
  updateSharedProjectsOrder
} from '../../apis/projectApis';

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

function* addProject(action: PayloadAction<ProjectCreateAction>) {
  try {
    const { description, name, projectType } = action.payload;
    const data = yield call(createProject, description, name, projectType);
    yield put(projectActions.projectReceived({ project: data }));
  } catch (error) {
    yield call(message.error, `Project Create Fail: ${error}`);
  }
}

function* updateSharedProjectOwnersOrder(action: PayloadAction<UpdateSharedProjectsOrderAction>) {
  try {
    const { projectOwners } = action.payload;
    yield call(updateSharedProjectsOrder, projectOwners);
    yield call(
      message.success,
      'Successfully updated SharedProjectOwnersOrder'
    );
  } catch (error) {
    yield call(message.error, `updateSharedProjectsOrder Fail: ${error}`);
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
