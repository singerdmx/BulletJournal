import { all, call, put, select, takeLatest } from 'redux-saga/effects';
import { message, notification } from 'antd';
import {
  actions as systemActions,
  GetPublicProjectItem, SetSharedItemLabels,
  SystemApiErrorAction,
  UpdateSystem,
} from './reducer';
import { PayloadAction } from 'redux-starter-kit';
import {
  fetchSystemUpdates,
  getPublicProjectItem, setSharedItemLabels,
} from '../../apis/systemApis';
import { ContentType } from '../myBuJo/constants';
import { getProject, updateProjects } from '../project/actions';
import { updateGroups } from '../group/actions';
import { updateNotifications } from '../notification/actions';
import { ProjectType } from '../project/constants';
import { Task } from '../tasks/interface';
import moment from 'moment-timezone';
import { ArgsProps } from 'antd/lib/notification';
import {Content} from "../myBuJo/interface";
import {updateTargetContent} from "../content/actions";

const fetchReminderFromLocal = () => {
  const defaultReminders = [] as Task[];
  const reminders = localStorage.getItem('reminders') || '';
  if (!reminders) {
    localStorage.setItem('reminders', JSON.stringify(defaultReminders));
    return defaultReminders;
  }
  return JSON.parse(reminders);
};

const taskNameMapper = (item: any) => item.id;

const saveTasksIntoLocal = (tasks: Task[]) => {
  localStorage.clear();
  localStorage.setItem('reminders', JSON.stringify(tasks));
};

function* systemApiErrorAction(action: PayloadAction<SystemApiErrorAction>) {
  yield call(message.error, `System Error Received: ${action.payload.error}`);
}

function* SystemUpdate(action: PayloadAction<UpdateSystem>) {
  try {
    const { force, history } = action.payload;
    const state = yield select();
    const {
      groupsEtag,
      notificationsEtag,
      ownedProjectsEtag,
      sharedProjectsEtag,
      remindingTaskEtag,
    } = state.system;

    const selectedProject = state.project.project;

    const data = yield call(
      fetchSystemUpdates,
      '',
      selectedProject && selectedProject.projectType !== ProjectType.LEDGER
        ? selectedProject.id
        : undefined,
      remindingTaskEtag
    );

    if (
      force || ownedProjectsEtag !== data.ownedProjectsEtag ||
      sharedProjectsEtag !== data.sharedProjectsEtag
    ) {
      yield put(updateProjects());
    }

    if (force || groupsEtag !== data.groupsEtag) {
      yield put(updateGroups());
    }

    if (force || notificationsEtag !== data.notificationsEtag) {
      yield put(updateNotifications());
    }

    let newComingTasks = [] as Task[];
    const now = new Date().getTime();
    let localReminders = fetchReminderFromLocal();
    let unExpiredLocalReminders = localReminders.filter((reminder: any) => {
      return now - reminder.time < 2 * 60 * 60 * 1000;
    });

    if (remindingTaskEtag !== data.remindingTaskEtag) {
      newComingTasks = data.reminders
        .map(taskNameMapper)
        .filter(
          (task: any) => !localReminders.map(taskNameMapper).includes(task)
        )
        .map((item: any) => ({
          id: item,
          time: now,
        }));
      yield all([
        ...newComingTasks
          .map((t) => {
            return data.reminders.find((reminder: any) => reminder.id === t.id);
          })
          .map((task: Task) => {
            const args: ArgsProps = {
              message: `"${task.name}" due at ${task.dueDate} ${task.dueTime ? task.dueTime : ''}`,
              duration: 99999,
              placement: 'topLeft',
              onClick: () => {
                history.push(`/task/${task.id}`);
              },
            };
            return call(notification.open, args);
          }),
      ]);
      saveTasksIntoLocal([...newComingTasks, ...unExpiredLocalReminders]);
    }

    let tasksEtag = state.system.tasksEtag;
    let notesEtag = state.system.notesEtag;

    if (selectedProject && !selectedProject.shared) {
      switch (selectedProject.projectType) {
        case ProjectType.TODO:
          if (force || data.tasksEtag !== tasksEtag) {
            tasksEtag = data.tasksEtag;
            yield put(getProject(selectedProject.id));
          }
          break;
        case ProjectType.NOTE:
          if (force || data.notesEtag !== notesEtag) {
            notesEtag = data.notesEtag;
            yield put(getProject(selectedProject.id));
          }
          break;
        default:
      }
    }

    yield put(
      systemActions.systemUpdateReceived({
        tasksEtag: tasksEtag,
        notesEtag: notesEtag,
        groupsEtag: data.groupsEtag,
        notificationsEtag: '', // already done by put(updateNotifications())
        ownedProjectsEtag: data.ownedProjectsEtag,
        sharedProjectsEtag: data.sharedProjectsEtag,
        remindingTaskEtag: data.remindingTaskEtag,
        reminders: data.reminders,
      })
    );
  } catch (error) {
    yield call(message.error, `SystemUpdate Error Received: ${error}`);
  }
}

function* getPublicItem(action: PayloadAction<GetPublicProjectItem>) {
  try {
    const { itemId } = action.payload;
    const data = yield call(getPublicProjectItem, itemId);
    const type: ContentType = data.contentType;
    const note = type === ContentType.NOTE ? data.projectItem : undefined;
    const task = type === ContentType.TASK ? data.projectItem : undefined;
    const contents : Content[] = data.contents;
    yield put(
      systemActions.publicProjectItemReceived({
        contentType: type,
        contents: contents,
        publicNote: note,
        publicTask: task,
        publicItemProjectId: data.projectId
      })
    );

    yield put(updateTargetContent(contents.length > 0 ? contents[0] : undefined));
  } catch (error) {
    yield call(message.error, `getPublicItem Received: ${error}`);
  }
}

function* putSharedItemLabels(action: PayloadAction<SetSharedItemLabels>) {
  try {
    const { itemId, labels } = action.payload;
    const data = yield call(setSharedItemLabels, itemId, labels);
    const type: ContentType = data.contentType;
    const note = type === ContentType.NOTE ? data.projectItem : undefined;
    const task = type === ContentType.TASK ? data.projectItem : undefined;
    yield put(
        systemActions.publicProjectItemReceived({
          contentType: type,
          contents: data.contents,
          publicNote: note,
          publicTask: task,
          publicItemProjectId: data.projectId
        })
    );
  } catch (error) {
    yield call(message.error, `setSharedItemLabels Received: ${error}`);
  }
}

export default function* systemSagas() {
  yield all([
    yield takeLatest(
      systemActions.systemApiErrorReceived.type,
      systemApiErrorAction
    ),
    yield takeLatest(systemActions.systemUpdate.type, SystemUpdate),
    yield takeLatest(systemActions.fetchPublicProjectItem.type, getPublicItem),
    yield takeLatest(systemActions.setSharedItemLabels.type, putSharedItemLabels),
  ]);
}
