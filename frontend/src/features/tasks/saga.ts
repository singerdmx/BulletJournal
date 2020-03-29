import { takeLatest, call, all, put } from 'redux-saga/effects';
import { message } from 'antd';
import {
  actions as tasksActions,
  TaskApiErrorAction,
  UpdateTasks,
  CreateTask,
  PutTask,
  GetTask,
  PatchTask,
  MoveTask,
  CompleteTask,
  UncompleteTask,
  SetTaskLabels, ShareTask
} from './reducer';
import { PayloadAction } from 'redux-starter-kit';
import {
  fetchTasks,
  fetchCompletedTasks,
  createTask,
  putTasks,
  getTaskById,
  updateTask,
  completeTaskById,
  deleteTaskById,
  uncompleteTaskById,
  setTaskLabels,
  moveToTargetProject, shareTaskWithOther
} from '../../apis/taskApis';
import { updateTasks } from './actions';

function* taskApiErrorReceived(action: PayloadAction<TaskApiErrorAction>) {
  yield call(message.error, `Notice Error Received: ${action.payload.error}`);
}

function* tasksUpdate(action: PayloadAction<UpdateTasks>) {
  try {
    const { projectId } = action.payload;
    const data = yield call(fetchTasks, projectId);
    const tasks = yield data.json();

    yield put(
      tasksActions.tasksReceived({
        tasks: tasks
      })
    );
  } catch (error) {
    yield call(message.error, `tasksUpdate Error Received: ${error}`);
  }
}

function* completedTasksUpdate(action: PayloadAction<UpdateTasks>) {
  try {
    const { projectId } = action.payload;
    const data = yield call(fetchCompletedTasks, projectId);
    const tasks = yield data.json();

    yield put(
      tasksActions.completedTasksReceived({
        tasks: tasks
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
      timezone
    } = action.payload;
    const data = yield call(
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
        tasks: updatedTasks
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

function* patchTask(action: PayloadAction<PatchTask>) {
  try {
    const {
      taskId,
      name,
      assignedTo,
      dueDate,
      dueTime,
      duration,
      reminderSetting
    } = action.payload;
    yield call(
      updateTask,
      taskId,
      name,
      assignedTo,
      dueDate,
      dueTime,
      duration,
      reminderSetting
    );
  } catch (error) {
    yield call(message.error, `Patch Task Error Received: ${error}`);
  }
}

function* completeTask(action: PayloadAction<CompleteTask>) {
  try {
    const { taskId } = action.payload;
    yield call(completeTaskById, taskId);
  } catch (error) {
    yield call(message.error, `Complete Task Error Received: ${error}`);
  }
}

function* uncompleteTask(action: PayloadAction<UncompleteTask>) {
  try {
    const { taskId } = action.payload;
    yield call(uncompleteTaskById, taskId);
  } catch (error) {
    yield call(message.error, `Uncomplete Task Error Received: ${error}`);
  }
}

function* deleteTask(action: PayloadAction<CompleteTask>) {
  try {
    const { taskId } = action.payload;
    const data = yield call(deleteTaskById, taskId);
    const updatedTasks = yield data.json();
    yield put(
      tasksActions.tasksReceived({
        tasks: updatedTasks
      })
    );
  } catch (error) {
    yield call(message.error, `Delete Task Error Received: ${error}`);
  }
}

function* moveTask(action: PayloadAction<MoveTask>) {
  try {
    const { taskId, targetProject, history } = action.payload;
    yield call(moveToTargetProject, taskId, targetProject);
    yield call(message.success, "Task moved successfully");
    history.push(`/projects/${targetProject}`);
  } catch (error) {
    yield call(message.error, `moveTask Error Received: ${error}`);
  }
}

function* shareTask(action: PayloadAction<ShareTask>) {
  try {
    const { taskId, targetUser, targetGroup, generateLink } = action.payload;
    yield call(shareTaskWithOther, taskId, targetUser, targetGroup, generateLink);
    yield call(message.success, 'Task shared successfully');
  } catch (error) {
    yield call(message.error, `shareTask Error Received: ${error}`);
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
    yield takeLatest(tasksActions.TaskPatch.type, patchTask),
    yield takeLatest(tasksActions.TaskComplete.type, completeTask),
    yield takeLatest(tasksActions.TaskUncomplete.type, uncompleteTask),
    yield takeLatest(tasksActions.TaskDelete.type, deleteTask),
    yield takeLatest(tasksActions.TaskSetLabels.type, taskSetLabels),
    yield takeLatest(tasksActions.TaskMove.type, moveTask),
    yield takeLatest(tasksActions.TaskShare.type, shareTask),
    yield takeLatest(
      tasksActions.CompletedTasksUpdate.type,
      completedTasksUpdate
    )
  ]);
}
