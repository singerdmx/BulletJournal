import { takeLatest, call, all, put, select } from 'redux-saga/effects';
import { message } from 'antd';
import {
  actions as projectActions,
  ProjectApiErrorAction,
  UpdateProjects,
  ProjectCreateAction,
  GetProjectAction,
  UpdateSharedProjectsOrderAction,
  DeleteProjectAction,
  PatchProjectAction,
  UpdateProjectRelationsAction
} from './reducer';
import { PayloadAction } from 'redux-starter-kit';
import {
  fetchProjects,
  createProject,
  getProject,
  updateSharedProjectsOrder,
  deleteProject,
  updateProject,
  updateProjectRelations
} from '../../apis/projectApis';
import { IState } from '../../store';
import { Project } from './interface';

function* projectApiErrorAction(action: PayloadAction<ProjectApiErrorAction>) {
  yield call(message.error, `Project Error Received: ${action.payload.error}`);
}

function* projectsUpdate(action: PayloadAction<UpdateProjects>) {
  try {
    const data = yield call(fetchProjects);
    const projects = yield data.json();
    const state = yield select();
    var ownEtag = state.project.ownedProjectsEtag;
    var shared = state.project.sharedProjectsEtag;
    if (data.headers.get('Etag')) {
      const etags = data.headers.get('Etag').split('|');
      ownEtag = etags[0];
      shared = etags[1];
    }
    yield put(
      projectActions.projectsReceived({
        owned: projects.owned,
        shared: projects.shared,
        ownedProjectsEtag: ownEtag,
        sharedProjectsEtag: shared
      })
    );
  } catch (error) {
    yield call(message.error, `Project Error Received: ${error}`);
  }
}

function* addProject(action: PayloadAction<ProjectCreateAction>) {
  const { description, groupId, name, projectType, history } = action.payload;
  try {
    const data: Project = yield call(
      createProject,
      description,
      groupId,
      name,
      projectType
    );
    yield put(projectActions.projectReceived({ project: data }));
    yield put(projectActions.projectsUpdate({}));
    history.push(`/projects/${data.id}`);
  } catch (error) {
    if (error.message === '400') {
      yield call(message.error, `Project with ${name} already exists`);
    } else {
      yield call(message.error, `Project Create Fail: ${error}`);
    }
  }
}

function* updateSharedProjectOwnersOrder(
  action: PayloadAction<UpdateSharedProjectsOrderAction>
) {
  try {
    const { projectOwners } = action.payload;
    const state: IState = yield select();
    yield put(
      projectActions.projectsReceived({
        owned: state.project.owned,
        shared: state.project.shared
          .slice()
          .sort(
            (p1, p2) =>
              projectOwners.indexOf(p1.owner) - projectOwners.indexOf(p2.owner)
          ),
        ownedProjectsEtag: '',
        sharedProjectsEtag: ''
      })
    );
    yield call(updateSharedProjectsOrder, projectOwners);
  } catch (error) {
    console.log(error);
    yield call(message.error, `updateSharedProjectsOrder Fail: ${error}`);
  }
}

function* getUserProject(action: PayloadAction<GetProjectAction>) {
  try {
    const { projectId } = action.payload;
    const data = yield call(getProject, projectId);
    yield put(projectActions.projectReceived({ project: data }));
  } catch (error) {
    yield call(message.error, `Get Project Error Received: ${error}`);
  }
}

function* deleteUserProject(action: PayloadAction<DeleteProjectAction>) {
  try {
    const { projectId, name } = action.payload;
    yield call(deleteProject, projectId);
    yield put(projectActions.projectsUpdate({}));
    yield call(message.success, `Project ${name} deleted`);
  } catch (error) {
    yield call(message.error, `Delete project fail: ${error}`);
  }
}

function* patchProject(action: PayloadAction<PatchProjectAction>) {
  try {
    const { projectId, description, groupId, name } = action.payload;
    const data = yield call(
      updateProject,
      projectId,
      description,
      groupId,
      name
    );
    yield put(projectActions.projectReceived({ project: data }));
    yield put(projectActions.projectsUpdate({}));
    yield call(message.success, 'Successfully updated project');
  } catch (error) {
    yield call(message.error, `update Project Fail: ${error}`);
  }
}

function* putProjectRelations(
  action: PayloadAction<UpdateProjectRelationsAction>
) {
  try {
    const { projects } = action.payload;
    const data = yield call(updateProjectRelations, projects);
    const updatedProjects = yield data.json();
    const etags = data.headers.get('Etag')!.split('|');
    const ownEtag = etags[0];
    const shared = etags[1];

    yield put(
      projectActions.projectsReceived({
        owned: updatedProjects.owned,
        shared: updatedProjects.shared,
        ownedProjectsEtag: ownEtag,
        sharedProjectsEtag: shared
      })
    );
    yield call(message.success, 'Successfully updated project relations');
  } catch (error) {
    yield call(message.error, `update Project relations Fail: ${error}`);
  }
}

export default function* projectSagas() {
  yield all([
    yield takeLatest(
      projectActions.projectsApiErrorReceived.type,
      projectApiErrorAction
    ),
    yield takeLatest(projectActions.projectsUpdate.type, projectsUpdate),
    yield takeLatest(projectActions.createProject.type, addProject),
    yield takeLatest(projectActions.deleteProject.type, deleteUserProject),
    yield takeLatest(projectActions.getProject.type, getUserProject),
    yield takeLatest(
      projectActions.updateSharedProjectsOrder.type,
      updateSharedProjectOwnersOrder
    ),
    yield takeLatest(projectActions.patchProject.type, patchProject),
    yield takeLatest(
      projectActions.updateProjectRelations.type,
      putProjectRelations
    )
  ]);
}
