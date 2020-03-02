import { takeLatest, call, all, put } from 'redux-saga/effects';
import { message } from 'antd';
import {
  actions as tasksActions,
  TaskApiErrorAction,
  UpdateTasks,
  CreateTask,
  PutTask,
  GetTask,
  PatchTask
} from './reducer';
import { PayloadAction } from 'redux-starter-kit';
import {
  fetchTasks, createTask, putTasks, getTaskById, updateTask
} from '../../apis/taskApis';
import { updateTasks } from './actions';

function* taskApiErrorReceived(action: PayloadAction<TaskApiErrorAction>) {
  yield call(message.error, `Notice Error Received: ${action.payload.error}`);
}

function* tasksUpdate(action: PayloadAction<UpdateTasks>) {
  try {
    const data = yield call(fetchTasks, action.payload.projectId);
    const tasks = yield data.json();

    yield put(
        tasksActions.tasksReceived({
        tasks: tasks
      })
    );
  } catch (error) {
    yield call(message.error, `Task Error Received: ${error}`);
  }
}

function* taskCreate(action: PayloadAction<CreateTask>) {
    try {
      const payload = action.payload;
      const data = yield call(createTask, payload.projectId,
        payload.name, payload.assignedTo, payload.dueDate, payload.dueTime,
        payload.duration, payload.reminderSetting);
      const task = yield data.json();
      yield put(updateTasks(action.payload.projectId));
    } catch (error) {
      yield call(message.error, `Task Error Received: ${error}`);
    }
  }

function* taskPut(action: PayloadAction<PutTask>) {
    try{
      const data = yield call(putTasks, action.payload.projectId, action.payload.tasks);
      yield put(updateTasks(action.payload.projectId));
    } catch (error) {
      yield call(message.error, `Put Task Error Received: ${error}`);
    }
}

function* getTask(action: PayloadAction<GetTask>) {
  try {
    const data = yield call(getTaskById, action.payload.taskId);
  } catch (error) {
    yield call(message.error, `Get Task Error Received: ${error}`);
  }
}

function* patchTask(action: PayloadAction<PatchTask>) {
  try {
    const payload = action.payload;
    yield call(updateTask, payload.taskId, payload.name, payload.assignedTo,
      payload.dueDate, payload.dueTime, payload.duration, payload.reminderSetting);
  } catch (error) {
    yield call(message.error, `Patch Task Error Received: ${error}`);
  }
}

export default function* taskSagas() {
  yield all([
    yield takeLatest(
      tasksActions.taskApiErrorReceived.type,
      taskApiErrorReceived
    ),
    yield takeLatest(
      tasksActions.TasksUpdate.type,
      tasksUpdate
    ),
    yield takeLatest(
        tasksActions.TasksCreate.type,
        taskCreate
    ),
    yield takeLatest(
          tasksActions.TaskPut.type,
          taskPut
    ),
    yield takeLatest(
          tasksActions.TaskGet.type,
          getTask
    ),
    yield takeLatest(
      tasksActions.TaskPatch.type,
      patchTask
    ),
  ]);
}