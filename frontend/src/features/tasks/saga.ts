import { all, call, put, select, takeLatest } from 'redux-saga/effects';
import { message } from 'antd';
import {
  actions as tasksActions,
  CompleteTask,
  CreateTask,
  DeleteTask,
  GetTask,
  MoveTask,
  PatchTask,
  PutTask,
  SetTaskLabels,
  ShareTask,
  TaskApiErrorAction,
  UncompleteTask,
  UpdateTasks,
  GetSharables,
  RevokeSharable,
  CreateContent,
  DeleteContent,
  PatchContent,
  UpdateTaskContentRevision,
  UpdateTaskContents,
} from './reducer';
import { PayloadAction } from 'redux-starter-kit';
import {
  completeTaskById,
  createTask,
  deleteCompletedTaskById,
  deleteTaskById,
  fetchCompletedTasks,
  fetchTasks,
  getCompletedTaskById,
  getTaskById,
  moveToTargetProject,
  putTasks,
  setTaskLabels,
  shareTaskWithOther,
  uncompleteTaskById,
  updateTask,
  deleteContent,
  getSharables,
  revokeSharable,
  addContent,
  getContents,
  getContentRevision,
  updateContent,
  getCompletedTaskContents,
} from '../../apis/taskApis';
import { updateTasks, updateTaskContents } from './actions';
import { getProjectItemsAfterUpdateSelect } from '../myBuJo/actions';
import { IState } from '../../store';
import { Content, Revision, ProjectItems } from '../myBuJo/interface';
import { updateItemsByLabels } from '../label/actions';

function* taskApiErrorReceived(action: PayloadAction<TaskApiErrorAction>) {
  yield call(message.error, `Notice Error Received: ${action.payload.error}`);
}

function* tasksUpdate(action: PayloadAction<UpdateTasks>) {
  try {
    const { projectId } = action.payload;
    const tasks = yield call(fetchTasks, projectId);

    yield put(
      tasksActions.tasksReceived({
        tasks: tasks,
      })
    );
  } catch (error) {
    yield call(message.error, `tasksUpdate Error Received: ${error}`);
  }
}

function* completedTasksUpdate(action: PayloadAction<UpdateTasks>) {
  try {
    const { projectId } = action.payload;
    const tasks = yield call(fetchCompletedTasks, projectId);

    yield put(
      tasksActions.completedTasksReceived({
        tasks: tasks,
      })
    );
  } catch (error) {
    yield call(message.error, `completedTasksUpdate Error Received: ${error}`);
  }
}

function* taskCreate(action: PayloadAction<CreateTask>) {
  try {
    const {
      projectId,
      name,
      assignedTo,
      dueDate,
      dueTime,
      duration,
      reminderSetting,
      recurrenceRule,
      timezone,
    } = action.payload;
    yield call(
      createTask,
      projectId,
      name,
      assignedTo,
      reminderSetting,
      timezone,
      dueDate,
      dueTime,
      duration,
      recurrenceRule
    );
    yield put(updateTasks(projectId));
  } catch (error) {
    yield call(message.error, `taskCreate Error Received: ${error}`);
  }
}

function* taskPut(action: PayloadAction<PutTask>) {
  try {
    const { projectId, tasks } = action.payload;
    const data = yield call(putTasks, projectId, tasks);
    const updatedTasks = yield data.json();
    yield put(
      tasksActions.tasksReceived({
        tasks: updatedTasks,
      })
    );
  } catch (error) {
    yield call(message.error, `Put Task Error Received: ${error}`);
  }
}

function* taskSetLabels(action: PayloadAction<SetTaskLabels>) {
  try {
    const { taskId, labels } = action.payload;
    const data = yield call(setTaskLabels, taskId, labels);
    yield put(tasksActions.taskReceived({ task: data }));
    yield put(updateTasks(data.projectId));
  } catch (error) {
    yield call(message.error, `taskSetLabels Error Received: ${error}`);
  }
}

function* getTask(action: PayloadAction<GetTask>) {
  try {
    const data = yield call(getTaskById, action.payload.taskId);
    yield put(tasksActions.taskReceived({ task: data }));
  } catch (error) {
    yield call(message.error, `Get Task Error Received: ${error}`);
  }
}

function* getCompletedTask(action: PayloadAction<GetTask>) {
  try {
    const data = yield call(getCompletedTaskById, action.payload.taskId);
    yield put(tasksActions.taskReceived({ task: data }));
  } catch (error) {
    yield call(message.error, `Get Task Error Received: ${error}`);
  }
}

function* patchTask(action: PayloadAction<PatchTask>) {
  try {
    const {
      taskId,
      name,
      assignedTo,
      dueDate,
      dueTime,
      duration,
      timezone,
      reminderSetting,
      recurrenceRule,
    } = action.payload;

    const data = yield call(
      updateTask,
      taskId,
      name,
      assignedTo,
      dueDate,
      dueTime,
      duration,
      timezone,
      reminderSetting,
      recurrenceRule
    );

    yield put(
      tasksActions.tasksReceived({
        tasks: data,
      })
    );

    const state: IState = yield select();

    yield put(
      getProjectItemsAfterUpdateSelect(
        state.myBuJo.todoSelected,
        state.myBuJo.ledgerSelected,
        'today'
      )
    );

    const task = yield call(getTaskById, taskId);
    yield put(
      tasksActions.taskReceived({
        task: task,
      })
    );
  } catch (error) {
    yield call(message.error, `Patch Task Error Received: ${error}`);
  }
}

function* completeTask(action: PayloadAction<CompleteTask>) {
  try {
    const { taskId, dateTime } = action.payload;
    const task = yield call(completeTaskById, taskId, dateTime);
    const tasks = yield call(fetchTasks, task.projectId);
    yield put(
      tasksActions.tasksReceived({
        tasks: tasks,
      })
    );
    const completedTasks = yield call(fetchCompletedTasks, task.projectId);
    yield put(
      tasksActions.completedTasksReceived({
        tasks: completedTasks,
      })
    );
    const state: IState = yield select();

    yield put(
      getProjectItemsAfterUpdateSelect(
        state.myBuJo.todoSelected,
        state.myBuJo.ledgerSelected,
        'today'
      )
    );
  } catch (error) {
    yield call(message.error, `Complete Task Error Received: ${error}`);
  }
}

function* uncompleteTask(action: PayloadAction<UncompleteTask>) {
  try {
    const { taskId } = action.payload;
    const task = yield call(uncompleteTaskById, taskId);
    const tasks = yield call(fetchTasks, task.projectId);
    yield put(
      tasksActions.tasksReceived({
        tasks: tasks,
      })
    );
    const completedTasks = yield call(fetchCompletedTasks, task.projectId);
    yield put(
      tasksActions.completedTasksReceived({
        tasks: completedTasks,
      })
    );
  } catch (error) {
    yield call(message.error, `Uncomplete Task Error Received: ${error}`);
  }
}

function* deleteTask(action: PayloadAction<DeleteTask>) {
  try {
    const { taskId } = action.payload;
    const data = yield call(deleteTaskById, taskId);
    const updatedTasks = yield data.json();
    yield put(
      tasksActions.tasksReceived({
        tasks: updatedTasks,
      })
    );

    const state: IState = yield select();

    yield put(
      getProjectItemsAfterUpdateSelect(
        state.myBuJo.todoSelected,
        state.myBuJo.ledgerSelected,
        'today'
      )
    );

    const labelItems: ProjectItems[] = [];
    state.label.items.forEach((projectItem: ProjectItems) => {
      projectItem = { ...projectItem };
      if (projectItem.tasks) {
        projectItem.tasks = projectItem.tasks.filter(
          (task) => task.id !== taskId
        );
      }
      labelItems.push(projectItem);
    });
    yield put(updateItemsByLabels(labelItems));
  } catch (error) {
    yield call(message.error, `Delete Task Error Received: ${error}`);
  }
}

function* deleteCompletedTask(action: PayloadAction<CompleteTask>) {
  try {
    const { taskId } = action.payload;
    const data = yield call(deleteCompletedTaskById, taskId);
    const updatedCompletedTasks = yield data.json();
    yield put(
      tasksActions.completedTasksReceived({
        tasks: updatedCompletedTasks,
      })
    );
  } catch (error) {
    yield call(message.error, `Delete Completed Task Error Received: ${error}`);
  }
}

function* moveTask(action: PayloadAction<MoveTask>) {
  try {
    const { taskId, targetProject, history } = action.payload;
    yield call(moveToTargetProject, taskId, targetProject);
    yield call(message.success, 'Task moved successfully');
    history.push(`/projects/${targetProject}`);
  } catch (error) {
    yield call(message.error, `moveTask Error Received: ${error}`);
  }
}

function* shareTask(action: PayloadAction<ShareTask>) {
  try {
    const {
      taskId,
      targetUser,
      targetGroup,
      generateLink,
      ttl,
    } = action.payload;
    const data = yield call(
      shareTaskWithOther,
      taskId,
      generateLink,
      targetUser,
      targetGroup,
      ttl
    );
    if (generateLink) {
      yield put(tasksActions.sharedLinkReceived({ link: data.link }));
    }
    yield call(message.success, 'Task shared successfully');
  } catch (error) {
    yield call(message.error, `shareTask Error Received: ${error}`);
  }
}

function* getTaskSharables(action: PayloadAction<GetSharables>) {
  try {
    const { taskId } = action.payload;
    const data = yield call(getSharables, taskId);

    yield put(
      tasksActions.taskSharablesReceived({
        users: data.users,
        links: data.links,
      })
    );
  } catch (error) {
    yield call(message.error, `getTaskSharables Error Received: ${error}`);
  }
}

function* revokeTaskSharable(action: PayloadAction<RevokeSharable>) {
  try {
    const { taskId, user, link } = action.payload;
    yield call(revokeSharable, taskId, user, link);

    const state: IState = yield select();

    let sharedUsers = state.task.sharedUsers;
    let sharedLinks = state.task.sharedLinks;

    if (user) {
      sharedUsers = sharedUsers.filter((u) => u.name !== user);
    }

    if (link) {
      sharedLinks = sharedLinks.filter((l) => l.link !== link);
    }

    yield put(
      tasksActions.taskSharablesReceived({
        users: sharedUsers,
        links: sharedLinks,
      })
    );
  } catch (error) {
    yield call(message.error, `revokeTaskSharable Error Received: ${error}`);
  }
}

function* createTaskContent(action: PayloadAction<CreateContent>) {
  try {
    const { taskId, text } = action.payload;
    yield call(addContent, taskId, text);
    yield put(updateTaskContents(taskId));
  } catch (error) {
    yield call(message.error, `createTaskContent Error Received: ${error}`);
  }
}

function* taskContentsUpdate(action: PayloadAction<UpdateTaskContents>) {
  try {
    const contents = yield call(getContents, action.payload.taskId);
    yield put(
      tasksActions.taskContentsReceived({
        contents: contents,
      })
    );
  } catch (error) {
    yield call(message.error, `taskContentsUpdate Error Received: ${error}`);
  }
}

function* completeTaskContentsUpdate(
  action: PayloadAction<UpdateTaskContents>
) {
  try {
    const contents = yield call(
      getCompletedTaskContents,
      action.payload.taskId
    );
    yield put(
      tasksActions.taskContentsReceived({
        contents: contents,
      })
    );
  } catch (error) {
    yield call(
      message.error,
      `completeTaskContentsUpdate Error Received: ${error}`
    );
  }
}

function* taskContentRevisionUpdate(
  action: PayloadAction<UpdateTaskContentRevision>
) {
  try {
    const { taskId, contentId, revisionId } = action.payload;
    const state: IState = yield select();

    const targetContent: Content = state.task.contents.find(
      (c) => c.id === contentId
    )!;
    const revision: Revision = targetContent.revisions.find(
      (r) => r.id === revisionId
    )!;

    if (!revision.content) {
      const data = yield call(
        getContentRevision,
        taskId,
        contentId,
        revisionId
      );

      const taskContents: Content[] = [];
      state.task.contents.forEach((taskContent) => {
        if (taskContent.id === contentId) {
          const newRevisions: Revision[] = [];
          taskContent.revisions.forEach((revision) => {
            if (revision.id === revisionId) {
              revision = { ...revision, content: data.content };
            }
            newRevisions.push(revision);
          });
          taskContent = { ...taskContent, revisions: newRevisions };
        }
        taskContents.push(taskContent);
      });

      yield put(
        tasksActions.taskContentsReceived({
          contents: taskContents,
        })
      );
    }
  } catch (error) {
    yield call(
      message.error,
      `taskContentRevisionUpdate Error Received: ${error}`
    );
  }
}

function* patchContent(action: PayloadAction<PatchContent>) {
  try {
    const { taskId, contentId, text } = action.payload;
    const contents = yield call(updateContent, taskId, contentId, text);
    yield put(
      tasksActions.taskContentsReceived({
        contents: contents,
      })
    );
  } catch (error) {
    yield call(message.error, `Patch Content Error Received: ${error}`);
  }
}

function* deleteTaskContent(action: PayloadAction<DeleteContent>) {
  try {
    const { taskId, contentId } = action.payload;
    const data = yield call(deleteContent, taskId, contentId);
    const contents = yield data.json();
    yield put(
      tasksActions.taskContentsReceived({
        contents: contents,
      })
    );
  } catch (error) {
    yield call(
      message.error,
      `taskContentDelete Task Error Received: ${error}`
    );
  }
}

export default function* taskSagas() {
  yield all([
    yield takeLatest(
      tasksActions.taskApiErrorReceived.type,
      taskApiErrorReceived
    ),
    yield takeLatest(tasksActions.TasksUpdate.type, tasksUpdate),
    yield takeLatest(tasksActions.TasksCreate.type, taskCreate),
    yield takeLatest(tasksActions.TaskPut.type, taskPut),
    yield takeLatest(tasksActions.TaskGet.type, getTask),
    yield takeLatest(tasksActions.CompletedTaskGet.type, getCompletedTask),
    yield takeLatest(tasksActions.TaskPatch.type, patchTask),
    yield takeLatest(tasksActions.TaskComplete.type, completeTask),
    yield takeLatest(tasksActions.TaskUncomplete.type, uncompleteTask),
    yield takeLatest(tasksActions.TaskDelete.type, deleteTask),
    yield takeLatest(
      tasksActions.CompletedTaskDelete.type,
      deleteCompletedTask
    ),
    yield takeLatest(tasksActions.TaskSetLabels.type, taskSetLabels),
    yield takeLatest(tasksActions.TaskMove.type, moveTask),
    yield takeLatest(tasksActions.TaskShare.type, shareTask),
    yield takeLatest(tasksActions.TaskSharablesGet.type, getTaskSharables),
    yield takeLatest(tasksActions.TaskRevokeSharable.type, revokeTaskSharable),
    yield takeLatest(
      tasksActions.CompletedTasksUpdate.type,
      completedTasksUpdate
    ),
    yield takeLatest(tasksActions.TaskContentsUpdate.type, taskContentsUpdate),
    yield takeLatest(
      tasksActions.TaskContentRevisionUpdate.type,
      taskContentRevisionUpdate
    ),
    yield takeLatest(tasksActions.TaskContentCreate.type, createTaskContent),
    yield takeLatest(tasksActions.TaskContentPatch.type, patchContent),
    yield takeLatest(tasksActions.TaskContentDelete.type, deleteTaskContent),
    yield takeLatest(
      tasksActions.CompleteTaskContentsUpdate.type,
      completeTaskContentsUpdate
    ),
  ]);
}
