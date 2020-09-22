import { all, call, put, select, takeLatest } from 'redux-saga/effects';
import { message } from 'antd';
import {
  actions as projectActions,
  DeleteProjectAction,
  GetProjectAction,
  PatchProjectAction,
  ProjectApiErrorAction,
  ProjectCreateAction,
  UpdateProjectRelationsAction,
  UpdateProjects,
  UpdateSharedProjectsOrderAction,
  GetProjectHistoryAction,
} from './reducer';
import { actions as groupsActions } from '../group/reducer';
import { actions as tasksActions } from '../tasks/reducer';
import { PayloadAction } from 'redux-starter-kit';
import {
  createProject,
  deleteProject,
  fetchProjects,
  getProject,
  updateProject,
  updateProjectRelations,
  updateSharedProjectsOrder,
  GetProjectHistory,
} from '../../apis/projectApis';
import { IState } from '../../store';
import { Project, Activity } from './interface';
import { actions as SystemActions } from '../system/reducer';

import {
  flattenOwnedProject,
  flattenSharedProject,
} from '../../pages/projects/projects.pages';
import {reloadReceived} from "../myself/actions";

function* projectApiErrorAction(action: PayloadAction<ProjectApiErrorAction>) {
  yield call(message.error, `Project Error Received: ${action.payload.error}`);
}

function* projectsUpdate(action: PayloadAction<UpdateProjects>) {
  try {
    const data = yield call(fetchProjects);
    const projects = yield data.json();
    const state = yield select();
    const systemState = state.system;

    if (data.headers.get('Etag')) {
      const etags = data.headers.get('Etag').split('|');
      yield put(
        SystemActions.systemUpdateReceived({
          ...systemState,
          ownedProjectsEtag: etags[0],
          sharedProjectsEtag: etags[1],
        })
      );
    }

    let flattenedProjects = [] as Project[];

    flattenOwnedProject(projects.owned, flattenedProjects);
    flattenSharedProject(projects.shared, flattenedProjects);

    yield put(
      projectActions.projectsReceived({
        owned: projects.owned,
        shared: projects.shared,
      })
    );

    const selectedProject = state.project.project;

    if (selectedProject) {
      const renewedProject = flattenedProjects.find(
        (prj: any) => prj.id === selectedProject.id
      );
      if (renewedProject) {
        yield put(
          projectActions.projectReceived({
            project: renewedProject,
          })
        );
      }
    }
  } catch (error) {
    if (error.message === 'reload') {
      yield put(reloadReceived(true));
    } else {
      yield call(message.error, `projectsUpdate Error Received: ${error}`);
    }
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
    if (history) {
      history.push(`/projects/${data.id}`);
    }
  } catch (error) {
    if (error.message === 'reload') {
      yield put(reloadReceived(true));
    } else if (error.message === '400') {
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
              projectOwners.indexOf(p1.owner.name) -
              projectOwners.indexOf(p2.owner.name)
          ),
      })
    );
    yield call(updateSharedProjectsOrder, projectOwners);
  } catch (error) {
    console.log(error);
    if (error.message === 'reload') {
      yield put(reloadReceived(true));
    } else {
      yield call(message.error, `updateSharedProjectsOrder Fail: ${error}`);
    }
  }
}

function* getUserProject(action: PayloadAction<GetProjectAction>) {
  try {
    const { projectId } = action.payload;
    const data: Project = yield call(getProject, projectId);
    yield put(projectActions.projectReceived({ project: data }));
    yield put(groupsActions.getGroup({ groupId: data.group.id }));
    yield put(tasksActions.updateCompletedTaskPageNo({completedTaskPageNo: 0}));
  } catch (error) {
    console.error(`Get Project Error Received: ${error}`);
  }
}

function* deleteUserProject(action: PayloadAction<DeleteProjectAction>) {
  try {
    const { projectId, name, history } = action.payload;
    yield call(deleteProject, projectId);
    history.goBack();
    yield put(projectActions.projectsUpdate({}));
    yield put(projectActions.projectReceived({ project: undefined }));
    yield call(message.success, `BuJo ${name} deleted`);
    history.push('/projects');
  } catch (error) {
    if (error.message === 'reload') {
      yield put(reloadReceived(true));
    } else {
      yield call(message.error, `Delete project fail: ${error}`);
    }
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
    yield put(groupsActions.getGroup({ groupId: data.group.id }));
    yield call(message.success, 'Successfully updated BuJo');
  } catch (error) {
    if (error.message === 'reload') {
      yield put(reloadReceived(true));
    } else {
      yield call(message.error, `update Project Fail: ${error}`);
    }
  }
}

function* putProjectRelations(
  action: PayloadAction<UpdateProjectRelationsAction>
) {
  try {
    const { projects } = action.payload;
    const state = yield select();
    const systemState = state.system;
    const data = yield call(
      updateProjectRelations,
      projects,
      systemState.ownedProjectsEtag
    );
    const updatedProjects = yield data.json();
    const etags = (data.headers.get('Etag') || '').split('|');
    if (etags.length === 2) {
      yield put(
        SystemActions.systemUpdateReceived({
          ownedProjectsEtag: etags[0],
          sharedProjectsEtag: etags[1],
          ...systemState,
        })
      );
    }
    yield put(
      projectActions.projectsReceived({
        owned: updatedProjects.owned,
        shared: updatedProjects.shared,
      })
    );
  } catch (error) {
    if (error.message === 'reload') {
      yield put(reloadReceived(true));
    } else {
      yield call(message.error, `update Project relations Fail: ${error}`);
    }
  }
}

function* getProjectHistory(action: PayloadAction<GetProjectHistoryAction>) {
  try {
    const {
      projectId,
      timezone,
      startDate,
      endDate,
      username,
    } = action.payload;

    const data: Activity[] = yield call(
      GetProjectHistory,
      projectId,
      timezone,
      startDate,
      endDate,
      action.payload.action,
      username
    );

    yield put(projectActions.historyReceived({ projectHistory: data }));
  } catch (error) {
    if (error.message === 'reload') {
      yield put(reloadReceived(true));
    } else {
      yield call(message.error, `Get Project History Error Received: ${error}`);
    }
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
    ),
    yield takeLatest(projectActions.getProjectHistory.type, getProjectHistory),
  ]);
}
