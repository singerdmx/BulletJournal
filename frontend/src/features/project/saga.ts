import { takeEvery, call, all, put } from 'redux-saga/effects';
import { message } from 'antd';
import {
  actions as projectActions,
  ProjectApiErrorAction,
  UpdateProjects,
  ProjectCreateAction,
  GetProjectAction,
  UpdateSharedProjectsOrderAction,
  DeleteProjectAction
} from './reducer';
import { PayloadAction } from 'redux-starter-kit';
import {
  fetchProjects,
  createProject,
  getProject,
  updateSharedProjectsOrder,
  deleteProject
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

function* getUserProject(action: PayloadAction<GetProjectAction>) {
  try {
    const { projectId } = action.payload;
    const data = yield call(getProject, projectId);
    console.log(data);
    yield put(projectActions.projectReceived({ project: data }));
  } catch (error) {
    yield call(message.error, `Get Group Error Received: ${error}`);
  }
}

function* deleteUserProject(action: PayloadAction<DeleteProjectAction>) {
  try {
    const { projectId } = action.payload;
    yield call(deleteProject, projectId);
    yield call(message.success, `Project ${projectId} deleted`);
  } catch (error) {
    yield call(message.error, `Delete project fail: ${error}`);
  }
}

export default function* projectSagas() {
  yield all([
    yield takeEvery(
      projectActions.projectsApiErrorReceived.type,
      projectApiErrorAction
    ),
    yield takeEvery(projectActions.projectsUpdate.type, projectsUpdate),
    yield takeEvery(projectActions.createProject.type, addProject),
    yield takeEvery(projectActions.deleteProject.type, deleteUserProject),
    yield takeEvery(projectActions.getProject.type, getUserProject),
    yield takeEvery(projectActions.updateSharedProjectsOrder.type, updateSharedProjectOwnersOrder),
  ]);
}
