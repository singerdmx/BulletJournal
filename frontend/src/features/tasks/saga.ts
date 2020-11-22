import {all, call, put, select, takeLatest} from 'redux-saga/effects';
import {message} from 'antd';
import {
  actions as tasksActions,
  CompleteTask,
  CompleteTasks,
  CreateContent,
  CreateTask,
  DeleteCompleteTask,
  DeleteContent,
  DeleteTask,
  DeleteTasks,
  GetSearchCompletedTasks,
  GetSharables,
  GetTask,
  GetTasksByAssignee,
  GetTasksByOrder,
  GetTaskStatisticsAction,
  MoveTask,
  PatchContent,
  PatchRevisionContents,
  PatchTask,
  PutTask,
  RemoveShared,
  RevokeSharable,
  SetTaskLabels,
  SetTaskStatus,
  ShareTask,
  TaskApiErrorAction,
  UncompleteTask,
  UpdateCompletedTasks,
  UpdateTaskContentRevision,
  UpdateTaskContents,
  UpdateTasks,
} from './reducer';
import {PayloadAction} from 'redux-starter-kit';
import {
  addContent,
  completeTaskById,
  completeTasks as completeTasksApi,
  createTask,
  deleteCompletedTaskById,
  deleteContent,
  deleteTaskById,
  deleteTasks as deleteTasksApi,
  fetchCompletedTasks,
  fetchTasks,
  getCompletedTaskById,
  getCompletedTaskContents,
  getContentRevision,
  getContents,
  getSharables,
  getTaskById,
  getTaskStatistics,
  moveToTargetProject,
  patchRevisionContents,
  putTasks,
  removeShared,
  revokeSharable,
  setTaskLabels,
  setTaskStatus as setTaskStatusApi,
  shareTaskWithOther,
  uncompleteTaskById,
  updateContent,
  updateSampleContent,
  updateTask
} from '../../apis/taskApis';
import {updateLoadingCompletedTask, updateTaskContents, updateTasks,} from './actions';
import {getProjectItemsAfterUpdateSelect} from '../myBuJo/actions';
import {IState} from '../../store';
import {Content, ProjectItems, Revision} from '../myBuJo/interface';
import {projectLabelsUpdate, updateItemsByLabels} from '../label/actions';
import {actions as SystemActions} from '../system/reducer';
import {completedTaskPageSize, ProjectItemUIType} from '../project/constants';
import {Task, TaskStatistics} from './interface';
import {recentItemsReceived} from '../recent/actions';
import {ContentType} from '../myBuJo/constants';
import {setDisplayMore, updateTargetContent} from "../content/actions";
import {reloadReceived} from "../myself/actions";
import {fetchSampleTask} from "../../apis/templates/workflowApis";

function* taskApiErrorReceived(action: PayloadAction<TaskApiErrorAction>) {
  yield call(message.error, `Notice Error Received: ${action.payload.error}`);
}

function* getTasksByAssignee(action: PayloadAction<GetTasksByAssignee>) {
  try {
    const {projectId, assignee} = action.payload;
    const data = yield call(fetchTasks, projectId, assignee);
    const tasksByAssignee = yield data.json();
    yield put(
        tasksActions.tasksByAssigneeReceived({
          tasksByAssignee: tasksByAssignee,
        })
    );
  } catch (error) {
    if (error.message === 'reload') {
      yield put(reloadReceived(true));
    } else {
      yield call(message.error, `getTasksByAssignee Error Received: ${error}`);
    }
  }
}

function* tasksUpdate(action: PayloadAction<UpdateTasks>) {
  try {
    const {projectId} = action.payload;
    const data = yield call(fetchTasks, projectId);
    const tasks = yield data.json();
    yield put(
        tasksActions.tasksReceived({
          tasks: tasks,
        })
    );

    //get etag from header
    const etag = data.headers.get('Etag')!;
    const state = yield select();
    const systemState = state.system;
    yield put(
        SystemActions.systemUpdateReceived({
          ...systemState,
          tasksEtag: etag,
        })
    );
  } catch (error) {
    if (error.message === 'reload') {
      yield put(reloadReceived(true));
    } else {
      yield call(message.error, `tasksUpdate Error Received: ${error}`);
    }
  }
}

function* completedTasksUpdate(action: PayloadAction<UpdateCompletedTasks>) {
  try {
    const {projectId} = action.payload;

    const state: IState = yield select();
    if (state.task.loadingCompletedTask) {
      yield call(message.info, 'Loading completed tasks in progress');
      return;
    }
    yield put(updateLoadingCompletedTask(true));
    if (state.task.completedTaskPageNo === 0) {
      const tasks = yield call(
          fetchCompletedTasks,
          projectId,
          state.task.completedTaskPageNo,
          completedTaskPageSize
      );
      yield put(
          tasksActions.completedTasksReceived({
            tasks: tasks,
          })
      );
    } else {
      yield put(
          tasksActions.completedTasksReceived({
            tasks: state.task.completedTasks.concat(
                state.task.nextCompletedTasks
            ),
          })
      );
    }

    const tasks = yield call(
        fetchCompletedTasks,
        projectId,
        state.task.completedTaskPageNo + 1,
        completedTaskPageSize
    );
    yield put(
        tasksActions.nextCompletedTasksReceived({
          tasks: tasks,
        })
    );
    yield put(
        tasksActions.updateCompletedTaskPageNo({
          completedTaskPageNo: state.task.completedTaskPageNo + 1,
        })
    );
  } catch (error) {
    if (error.message === 'reload') {
      yield put(reloadReceived(true));
    } else {
      yield call(message.error, `completedTasksUpdate Error Received: ${error}`);
    }
  }
  yield put(updateLoadingCompletedTask(false));
}

function* taskCreate(action: PayloadAction<CreateTask>) {
  try {
    const {
      projectId,
      name,
      assignees,
      dueDate,
      dueTime,
      duration,
      reminderSetting,
      recurrenceRule,
      timezone,
      labels,
    } = action.payload;
    yield call(
        createTask,
        projectId,
        name,
        assignees,
        reminderSetting,
        timezone,
        dueDate,
        dueTime,
        duration,
        recurrenceRule,
        labels
    );
    yield put(updateTasks(projectId));
    const state: IState = yield select();
    if (state.project.project) {
      yield put(projectLabelsUpdate(state.project.project.id, state.project.project.shared));
    }
  } catch (error) {
    if (error.message === 'reload') {
      yield put(reloadReceived(true));
    } else {
      yield call(message.error, `taskCreate Error Received: ${error}`);
    }
  }
}

function* taskPut(action: PayloadAction<PutTask>) {
  try {
    const {projectId, tasks} = action.payload;
    const state: IState = yield select();
    const data = yield call(putTasks, projectId, tasks, state.system.tasksEtag);
    const updatedTasks = yield data.json();
    yield put(
        tasksActions.tasksReceived({
          tasks: updatedTasks,
        })
    );

    //get etag from header
    const etag = data.headers.get('Etag')!;
    const systemState = state.system;
    yield put(
        SystemActions.systemUpdateReceived({
          ...systemState,
          tasksEtag: etag,
        })
    );
  } catch (error) {
    if (error.message === 'reload') {
      yield put(reloadReceived(true));
    } else {
      yield call(message.error, `Put Task Error Received: ${error}`);
    }
  }
}

function* taskSetLabels(action: PayloadAction<SetTaskLabels>) {
  try {
    const {taskId, labels} = action.payload;
    const data = yield call(setTaskLabels, taskId, labels);
    yield put(tasksActions.taskReceived({task: data}));
    yield put(updateTasks(data.projectId));
  } catch (error) {
    if (error.message === 'reload') {
      yield put(reloadReceived(true));
    } else {
      yield call(message.error, `taskSetLabels Error Received: ${error}`);
    }
  }
}

function* getTask(action: PayloadAction<GetTask>) {
  try {
    const data = yield call(getTaskById, action.payload.taskId);
    yield put(tasksActions.taskReceived({task: data}));
  } catch (error) {
    if (error.message === 'reload') {
      yield put(reloadReceived(true));
    } else {
      yield call(message.error, 'Task Unavailable');
    }
  }
}

function* getSampleTask(action: PayloadAction<GetTask>) {
  try {
    const data = yield call(fetchSampleTask, action.payload.taskId);
    yield put(tasksActions.taskReceived({task: data.task}));
    const content : Content = data.content;
    yield put(
        tasksActions.taskContentsReceived({
          contents: [content],
        })
    );
    yield put(updateTargetContent(content));
  } catch (error) {
    if (error.message === 'reload') {
      yield put(reloadReceived(true));
    } else {
      yield call(message.error, 'Sample Task Unavailable');
    }
  }
}

function* getCompletedTask(action: PayloadAction<GetTask>) {
  try {
    const data = yield call(getCompletedTaskById, action.payload.taskId);
    yield put(tasksActions.taskReceived({task: data}));
  } catch (error) {
    if (error.message === 'reload') {
      yield put(reloadReceived(true));
    } else {
      yield call(message.error, `Get Task Error Received: ${error}`);
    }
  }
}

function* patchTask(action: PayloadAction<PatchTask>) {
  try {
    const {
      taskId,
      name,
      type,
      assignees,
      dueDate,
      dueTime,
      duration,
      timezone,
      reminderSetting,
      recurrenceRule,
      labels,
    } = action.payload;

    const data = yield call(
        updateTask,
        taskId,
        name,
        assignees,
        dueDate,
        dueTime,
        duration,
        timezone,
        reminderSetting,
        recurrenceRule,
        labels
    );

    yield put(
        tasksActions.tasksReceived({
          tasks: data,
        })
    );

    const state: IState = yield select();

    if (type === ProjectItemUIType.ORDER && state.project.project) {
      const data = yield call(
          fetchTasks,
          state.project.project.id,
          undefined,
          timezone,
          undefined,
          undefined,
          true
      );
      const tasksByOrder = yield data.json();
      yield put(
          tasksActions.tasksByOrderReceived({
            tasksByOrder: tasksByOrder,
          })
      );
    }

    if (type === ProjectItemUIType.TODAY) {
      yield put(
          getProjectItemsAfterUpdateSelect(
              state.myBuJo.todoSelected,
              state.myBuJo.ledgerSelected,
              state.myBuJo.noteSelected,
              'today'
          )
      );
    }

    const task = yield call(getTaskById, taskId);
    yield put(
        tasksActions.taskReceived({
          task: task,
        })
    );

    //update label search page
    const labelItems: ProjectItems[] = [];
    state.label.items.forEach((projectItem: ProjectItems) => {
      projectItem = {...projectItem};
      if (projectItem.tasks) {
        projectItem.tasks = projectItem.tasks.map((eachTask) => {
          if (eachTask.id === taskId) return task;
          else return eachTask;
        });
      }
      labelItems.push(projectItem);
    });
    yield put(updateItemsByLabels(labelItems));

    if (state.project.project && ![ProjectItemUIType.LABEL, ProjectItemUIType.TODAY, ProjectItemUIType.RECENT].includes(type)) {
      yield put(projectLabelsUpdate(state.project.project.id, state.project.project.shared));
    }
  } catch (error) {
    if (error.message === 'reload') {
      yield put(reloadReceived(true));
    } else {
      yield call(message.error, `Patch Task Error Received: ${error}`);
    }
  }
}

function* completeTask(action: PayloadAction<CompleteTask>) {
  try {
    const {taskId, dateTime, type} = action.payload;
    const task = yield call(completeTaskById, taskId, dateTime);
    const state: IState = yield select();

    if (type === ProjectItemUIType.PROJECT || type === ProjectItemUIType.PAGE) {
      const data = yield call(fetchTasks, task.projectId);
      const tasks = yield data.json();
      yield put(
          tasksActions.tasksReceived({
            tasks: tasks,
          })
      );

      //get etag from header
      const etag = data.headers.get('Etag')!;
      const systemState = state.system;
      yield put(
          SystemActions.systemUpdateReceived({
            ...systemState,
            tasksEtag: etag,
          })
      );

      const completedTaskPageNo = state.task.completedTaskPageNo;
      if (completedTaskPageNo > 0) {
        const completedTasks = yield call(
            fetchCompletedTasks,
            task.projectId,
            0,
            completedTaskPageNo * completedTaskPageSize
        );
        yield put(
            tasksActions.completedTasksReceived({
              tasks: completedTasks,
            })
        );
        const tasks = yield call(
            fetchCompletedTasks,
            task.projectId,
            completedTaskPageNo,
            completedTaskPageSize
        );
        yield put(
            tasksActions.nextCompletedTasksReceived({
              tasks: tasks,
            })
        );
      }
    }

    if (type === ProjectItemUIType.TODAY) {
      yield put(
          getProjectItemsAfterUpdateSelect(
              state.myBuJo.todoSelected,
              state.myBuJo.ledgerSelected,
              state.myBuJo.noteSelected,
              'today'
          )
      );
    }

    if (type === ProjectItemUIType.ASSIGNEE) {
      const tasksByAssignee = state.task.tasksByAssignee.filter(
          (t) => t.id !== taskId
      );
      yield put(
          tasksActions.tasksByAssigneeReceived({
            tasksByAssignee: tasksByAssignee,
          })
      );
    }

    if (type === ProjectItemUIType.ORDER) {
      const tasksByOrder = state.task.tasksByOrder.filter(
          (t) => t.id !== taskId
      );
      yield put(
          tasksActions.tasksByOrderReceived({
            tasksByOrder: tasksByOrder,
          })
      );
    }

    if (type === ProjectItemUIType.LABEL) {
      const labelItems: ProjectItems[] = [];
      state.label.items.forEach((projectItem: ProjectItems) => {
        projectItem = {...projectItem};
        if (projectItem.tasks) {
          projectItem.tasks = projectItem.tasks.filter(
              (task) => task.id !== taskId
          );
        }
        labelItems.push(projectItem);
      });
      yield put(updateItemsByLabels(labelItems));
    }

    if (type === ProjectItemUIType.RECENT) {
      const recentItems = state.recent.items.filter(
          (t) => t.contentType !== ContentType.TASK || t.id !== taskId
      );
      yield put(recentItemsReceived(recentItems));
    }

    yield put(tasksActions.taskReceived({task: undefined}));

    if (state.project.project && ![ProjectItemUIType.LABEL, ProjectItemUIType.TODAY, ProjectItemUIType.RECENT].includes(type)) {
      yield put(projectLabelsUpdate(state.project.project.id, state.project.project.shared));
    }
  } catch (error) {
    if (error.message === 'reload') {
      yield put(reloadReceived(true));
    } else {
      yield call(message.error, `Complete Task Error Received: ${error}`);
    }
  }
}

function* uncompleteTask(action: PayloadAction<UncompleteTask>) {
  try {
    const {taskId} = action.payload;
    const task = yield call(uncompleteTaskById, taskId);
    const data = yield call(fetchTasks, task.projectId);
    const tasks = yield data.json();
    yield put(
        tasksActions.tasksReceived({
          tasks: tasks,
        })
    );
    const state: IState = yield select();
    //get etag from header
    const etag = data.headers.get('Etag')!;
    const systemState = state.system;
    yield put(
        SystemActions.systemUpdateReceived({
          ...systemState,
          tasksEtag: etag,
        })
    );
    const completedTaskPageNo = state.task.completedTaskPageNo;
    if (completedTaskPageNo > 0) {
      const completedTasks = yield call(
          fetchCompletedTasks,
          task.projectId,
          0,
          completedTaskPageNo * completedTaskPageSize
      );
      yield put(
          tasksActions.completedTasksReceived({
            tasks: completedTasks,
          })
      );
      const tasks = yield call(
          fetchCompletedTasks,
          task.projectId,
          completedTaskPageNo,
          completedTaskPageSize
      );
      yield put(
          tasksActions.nextCompletedTasksReceived({
            tasks: tasks,
          })
      );
    }
    const searchCompletedTasks = state.task.searchCompletedTasks.filter(
        (t) => t.id !== taskId
    );
    yield put(
        tasksActions.searchCompletedTasksReceived({
          searchCompletedTasks: searchCompletedTasks,
        })
    );
    if (state.project.project) {
      yield put(projectLabelsUpdate(state.project.project.id, state.project.project.shared));
    }
  } catch (error) {
    if (error.message === 'reload') {
      yield put(reloadReceived(true));
    } else {
      yield call(message.error, `Uncomplete Task Error Received: ${error}`);
    }
  }
}

function* deleteTask(action: PayloadAction<DeleteTask>) {
  try {
    const {taskId, type} = action.payload;
    const data = yield call(deleteTaskById, taskId);
    const updatedTasks = yield data.json();
    yield put(
        tasksActions.tasksReceived({
          tasks: updatedTasks,
        })
    );
    yield put(tasksActions.taskReceived({task: undefined}));
    const state: IState = yield select();

    if (type === ProjectItemUIType.TODAY) {
      yield put(
          getProjectItemsAfterUpdateSelect(
              state.myBuJo.todoSelected,
              state.myBuJo.ledgerSelected,
              state.myBuJo.noteSelected,
              'today'
          )
      );
    }

    if (type === ProjectItemUIType.LABEL) {
      const labelItems: ProjectItems[] = [];
      state.label.items.forEach((projectItem: ProjectItems) => {
        projectItem = {...projectItem};
        if (projectItem.tasks) {
          projectItem.tasks = projectItem.tasks.filter(
              (task) => task.id !== taskId
          );
        }
        labelItems.push(projectItem);
      });
      yield put(updateItemsByLabels(labelItems));
    }

    if (type === ProjectItemUIType.ASSIGNEE) {
      const tasksByAssignee = state.task.tasksByAssignee.filter(
          (t) => t.id !== taskId
      );
      yield put(
          tasksActions.tasksByAssigneeReceived({
            tasksByAssignee: tasksByAssignee,
          })
      );
    }

    if (type === ProjectItemUIType.ORDER) {
      const tasksByOrder = state.task.tasksByOrder.filter(
          (t) => t.id !== taskId
      );
      yield put(
          tasksActions.tasksByOrderReceived({
            tasksByOrder: tasksByOrder,
          })
      );
    }

    if (type === ProjectItemUIType.RECENT) {
      const recentItems = state.recent.items.filter(
          (t) => t.contentType !== ContentType.TASK || t.id !== taskId
      );
      yield put(recentItemsReceived(recentItems));
    }

    yield put(tasksActions.taskReceived({task: undefined}));
    if (state.project.project && ![ProjectItemUIType.LABEL, ProjectItemUIType.TODAY, ProjectItemUIType.RECENT].includes(type)) {
      yield put(projectLabelsUpdate(state.project.project.id, state.project.project.shared));
    }
  } catch (error) {
    if (error.message === 'reload') {
      yield put(reloadReceived(true));
    } else {
      yield call(message.error, `Delete Task Error Received: ${error}`);
    }
  }
}

function* deleteTasks(action: PayloadAction<DeleteTasks>) {
  try {
    const {projectId, tasksId, type} = action.payload;

    const data = yield call(deleteTasksApi, projectId, tasksId);
    const tasks: Task[] = yield data.json();

    yield put(
        tasksActions.tasksReceived({
          tasks: tasks,
        })
    );

    yield put(tasksActions.taskReceived({task: undefined}));
    const state: IState = yield select();

    if (type === ProjectItemUIType.ASSIGNEE) {
      const tasksByAssignee = state.task.tasksByAssignee.filter(
          (t) => !tasksId.includes(t.id)
      );
      yield put(
          tasksActions.tasksByAssigneeReceived({
            tasksByAssignee: tasksByAssignee,
          })
      );
    }

    if (type === ProjectItemUIType.ORDER) {
      const tasksByOrder = state.task.tasksByOrder.filter(
          (t) => !tasksId.includes(t.id)
      );
      yield put(
          tasksActions.tasksByOrderReceived({
            tasksByOrder: tasksByOrder,
          })
      );
    }

    yield put(tasksActions.taskReceived({task: undefined}));
    if (state.project.project && ![ProjectItemUIType.LABEL, ProjectItemUIType.TODAY, ProjectItemUIType.RECENT].includes(type)) {
      yield put(projectLabelsUpdate(state.project.project.id, state.project.project.shared));
    }
  } catch (error) {
    if (error.message === 'reload') {
      yield put(reloadReceived(true));
    } else {
      yield call(message.error, `Delete Tasks Error Received: ${error}`);
    }
  }
}

function* completeTasks(action: PayloadAction<CompleteTasks>) {
  try {
    const {projectId, tasksId, type} = action.payload;
    const state: IState = yield select();
    const data = yield call(completeTasksApi, projectId, tasksId);
    const tasks: Task[] = yield data.json();

    yield put(
        tasksActions.tasksReceived({
          tasks: tasks,
        })
    );

    //refetch completed tasks
    yield put(
        tasksActions.updateCompletedTaskPageNo({completedTaskPageNo: 0})
    );
    yield put(tasksActions.completedTasksReceived({tasks: []}));

    yield put(tasksActions.taskReceived({task: undefined}));

    if (type === ProjectItemUIType.ASSIGNEE) {
      const tasksByAssignee = state.task.tasksByAssignee.filter(
          (t) => !tasksId.includes(t.id)
      );
      yield put(
          tasksActions.tasksByAssigneeReceived({
            tasksByAssignee: tasksByAssignee,
          })
      );
    }

    if (type === ProjectItemUIType.ORDER) {
      const tasksByOrder = state.task.tasksByOrder.filter(
          (t) => !tasksId.includes(t.id)
      );
      yield put(
          tasksActions.tasksByOrderReceived({
            tasksByOrder: tasksByOrder,
          })
      );
    }

    yield put(tasksActions.taskReceived({task: undefined}));
    if (state.project.project && ![ProjectItemUIType.LABEL, ProjectItemUIType.TODAY, ProjectItemUIType.RECENT].includes(type)) {
      yield put(projectLabelsUpdate(state.project.project.id, state.project.project.shared));
    }
  } catch (error) {
    if (error.message === 'reload') {
      yield put(reloadReceived(true));
    } else {
      yield call(message.error, `complete Tasks Error Received: ${error}`);
    }
  }
}

function* deleteCompletedTask(action: PayloadAction<DeleteCompleteTask>) {
  try {
    const {taskId} = action.payload;
    const data = yield call(deleteCompletedTaskById, taskId);
    const updatedCompletedTasks = yield data.json();
    yield put(
        tasksActions.completedTasksReceived({
          tasks: updatedCompletedTasks,
        })
    );

    const state: IState = yield select();
    const searchCompletedTasks = state.task.searchCompletedTasks.filter(
        (t) => t.id !== taskId
    );
    yield put(
        tasksActions.searchCompletedTasksReceived({
          searchCompletedTasks: searchCompletedTasks,
        })
    );
  } catch (error) {
    if (error.message === 'reload') {
      yield put(reloadReceived(true));
    } else {
      yield call(message.error, `Delete Completed Task Error Received: ${error}`);
    }
  }
}

function* moveTask(action: PayloadAction<MoveTask>) {
  try {
    const {taskId, targetProject, history} = action.payload;
    yield call(moveToTargetProject, taskId, targetProject);
    yield call(message.success, 'Task moved successfully');
    history.push(`/projects/${targetProject}`);
  } catch (error) {
    if (error.message === 'reload') {
      yield put(reloadReceived(true));
    } else {
      yield call(message.error, `moveTask Error Received: ${error}`);
    }
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
      yield put(tasksActions.sharedLinkReceived({link: data.link}));
    }
    yield call(message.success, 'Task shared successfully');
  } catch (error) {
    if (error.message === 'reload') {
      yield put(reloadReceived(true));
    } else {
      yield call(message.error, `shareTask Error Received: ${error}`);
    }
  }
}

function* getTaskSharables(action: PayloadAction<GetSharables>) {
  try {
    const {taskId} = action.payload;
    const data = yield call(getSharables, taskId);

    yield put(
        tasksActions.taskSharablesReceived({
          users: data.users,
          links: data.links,
        })
    );
  } catch (error) {
    if (error.message === 'reload') {
      yield put(reloadReceived(true));
    } else {
      yield call(message.error, `getTaskSharables Error Received: ${error}`);
    }
  }
}

function* revokeTaskSharable(action: PayloadAction<RevokeSharable>) {
  try {
    const {taskId, user, link} = action.payload;
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
    if (error.message === 'reload') {
      yield put(reloadReceived(true));
    } else {
      yield call(message.error, `revokeTaskSharable Error Received: ${error}`);
    }
  }
}

function* removeSharedTask(action: PayloadAction<RemoveShared>) {
  try {
    const {taskId} = action.payload;
    yield call(removeShared, taskId);
  } catch (error) {
    if (error.message === 'reload') {
      yield put(reloadReceived(true));
    } else {
      yield call(message.error, `removeSharedTask Error Received: ${error}`);
    }
  }
}

function* createTaskContent(action: PayloadAction<CreateContent>) {
  try {
    const {taskId, text} = action.payload;
    const content: Content = yield call(addContent, taskId, text);
    yield put(updateTaskContents(taskId));
    yield put(updateTargetContent(content));
  } catch (error) {
    if (error.message === 'reload') {
      yield put(reloadReceived(true));
    } else {
      yield call(message.error, `createTaskContent Error Received: ${error}`);
    }
  }
}

function* taskContentsUpdate(action: PayloadAction<UpdateTaskContents>) {
  try {
    const { taskId, updateDisplayMore } = action.payload;
    const contents : Content[] = yield call(getContents, taskId);
    yield put(
        tasksActions.taskContentsReceived({
          contents: contents,
        })
    );
    let targetContent = undefined;
    if (contents && contents.length > 0) {
      const state: IState = yield select();
      targetContent = contents[0];
      if (state.content.content && state.content.content.id) {
        const found = contents.find((c) => c.id === state.content.content!.id);
        if (found) {
          targetContent = found;
        }
      }
    }
    yield put(updateTargetContent(targetContent));

    if (updateDisplayMore === true) {
      yield put(setDisplayMore(true));
    }
  } catch (error) {
    if (error.message === 'reload') {
      yield put(reloadReceived(true));
    } else if (error.message === '404') {
      console.log(`Task ${action.payload.taskId} not found`);
    } else {
      yield call(message.error, `taskContentsUpdate Error Received: ${error}`);
    }
  }
}

function* completeTaskContentsUpdate(
    action: PayloadAction<UpdateTaskContents>
) {
  try {
    const data: Content[] = yield call(
        getCompletedTaskContents,
        action.payload.taskId
    );
    const contents = [] as Content[];
    data.forEach((c, index) => {
      contents.push({...c, id: index});
    });
    yield put(
        tasksActions.taskContentsReceived({
          contents: contents,
        })
    );
    if (contents && contents.length > 0) {
      yield put(updateTargetContent(contents[0]));
    } else {
      yield put(updateTargetContent(undefined));
    }
  } catch (error) {
    if (error.message === 'reload') {
      yield put(reloadReceived(true));
    } else {
      yield call(
          message.error,
          `completeTaskContentsUpdate Error Received: ${error}`
      );
    }
  }
}

function* taskContentRevisionUpdate(
    action: PayloadAction<UpdateTaskContentRevision>
) {
  try {
    const {taskId, contentId, revisionId} = action.payload;
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
              revision = {...revision, content: data.content};
            }
            newRevisions.push(revision);
          });
          taskContent = {...taskContent, revisions: newRevisions};
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
    if (error.message === 'reload') {
      yield put(reloadReceived(true));
    } else {
      yield call(
          message.error,
          `taskContentRevisionUpdate Error Received: ${error}`
      );
    }
  }
}

function* patchContent(action: PayloadAction<PatchContent>) {
  try {
    const {taskId, contentId, text, diff} = action.payload;
    const state: IState = yield select();
    const order = state.task.contents.map(c => c.id);

    const contents: Content[] = yield call(updateContent, taskId, contentId, text, state.content.content!.etag, diff);
    contents.sort((a: Content, b: Content) => {
      return order.findIndex((o) => o === a.id) - order.findIndex((o) => o === b.id);
    });
    yield put(
        tasksActions.taskContentsReceived({
          contents: contents,
        })
    );
    yield put(updateTargetContent(contents.filter(c => c.id === contentId)[0]));
  } catch (error) {
    if (error.message === 'reload') {
      yield put(reloadReceived(true));
    } else {
      yield call(message.error, `Patch Content Error Received: ${error}`);
    }
  }
}

function* patchSampleContent(action: PayloadAction<PatchContent>) {
  try {
    const {taskId, text} = action.payload;
    const content : Content = yield call(updateSampleContent, taskId, text);
    yield put(
        tasksActions.taskContentsReceived({
          contents: [content],
        })
    );
    yield put(updateTargetContent(content));
  } catch (error) {
    if (error.message === 'reload') {
      yield put(reloadReceived(true));
    } else {
      yield call(message.error, `Patch Sample Task Content Error Received: ${error}`);
    }
  }
}

function* setTaskStatus(action: PayloadAction<SetTaskStatus>) {
  try {
    const state: IState = yield select();
    const {taskId, taskStatus, type} = action.payload;
    const data = yield call(setTaskStatusApi, taskId, taskStatus, state.myself.timezone);

    yield put(
        tasksActions.tasksByOrderReceived({
          tasksByOrder: data,
        })
    );

    const task = yield call(getTaskById, taskId);
    yield put(
        tasksActions.taskReceived({
          task: task,
        })
    );

    if (state.project.project && type === ProjectItemUIType.PROJECT) {
      const data = yield call(fetchTasks, state.project.project.id);
      const tasks = yield data.json();
      yield put(
          tasksActions.tasksReceived({
            tasks: tasks,
          })
      );

      //get etag from header
      const etag = data.headers.get('Etag')!;
      const systemState = state.system;
      yield put(
          SystemActions.systemUpdateReceived({
            ...systemState,
            tasksEtag: etag,
          })
      );
    }

    if (type === ProjectItemUIType.TODAY) {
      yield put(
          getProjectItemsAfterUpdateSelect(
              state.myBuJo.todoSelected,
              state.myBuJo.ledgerSelected,
              state.myBuJo.noteSelected,
              'today'
          )
      );
    }

    //update label search page
    const labelItems: ProjectItems[] = [];
    state.label.items.forEach((projectItem: ProjectItems) => {
      projectItem = {...projectItem};
      if (projectItem.tasks) {
        projectItem.tasks = projectItem.tasks.map((eachTask) => {
          if (eachTask.id === taskId) return task;
          else return eachTask;
        });
      }
      labelItems.push(projectItem);
    });
    yield put(updateItemsByLabels(labelItems));
  } catch (error) {
    if (error.message === 'reload') {
      yield put(reloadReceived(true));
    } else {
      yield call(message.error, `set Task Status Error Received: ${error}`);
    }
  }
}

function* deleteTaskContent(action: PayloadAction<DeleteContent>) {
  try {
    const {taskId, contentId} = action.payload;
    const data = yield call(deleteContent, taskId, contentId);
    const contents = yield data.json();
    yield put(
        tasksActions.taskContentsReceived({
          contents: contents,
        })
    );
    yield put(updateTargetContent(contents.length > 0 ? contents[0] : undefined));
  } catch (error) {
    if (error.message === 'reload') {
      yield put(reloadReceived(true));
    } else {
      yield call(
          message.error,
          `taskContentDelete Task Error Received: ${error}`
      );
    }
  }
}

function* getTasksByOrder(action: PayloadAction<GetTasksByOrder>) {
  try {
    const {projectId, timezone, startDate, endDate} = action.payload;
    const data = yield call(
        fetchTasks,
        projectId,
        undefined,
        timezone,
        startDate,
        endDate,
        true
    );
    const tasksByOrder = yield data.json();
    yield put(
        tasksActions.tasksByOrderReceived({
          tasksByOrder: tasksByOrder,
        })
    );
  } catch (error) {
    if (error.message === 'reload') {
      yield put(reloadReceived(true));
    } else {
      yield call(message.error, `getTasksByOrder Error Received: ${error}`);
    }
  }
}

function* getSearchCompletedTasks(
    action: PayloadAction<GetSearchCompletedTasks>
) {
  try {
    const {
      projectId,
      assignee,
      startDate,
      endDate,
      timezone,
    } = action.payload;
    const searchCompletedTasks = yield call(
        fetchCompletedTasks,
        projectId,
        1,
        1,
        assignee,
        startDate,
        endDate,
        timezone
    );

    yield put(
        tasksActions.searchCompletedTasksReceived({
          searchCompletedTasks: searchCompletedTasks,
        })
    );
  } catch (error) {
    if (error.message === 'reload') {
      yield put(reloadReceived(true));
    } else {
      yield call(
          message.error,
          `get search completed tasks Error Received: ${error}`
      );
    }
  }
}

function* patchTaskRevisionContents(action: PayloadAction<PatchRevisionContents>) {
  try {
    const {taskId, contentId, revisionContents, etag} = action.payload;
    const data : Content = yield call(patchRevisionContents, taskId, contentId, revisionContents, etag);
    const state: IState = yield select();
    console.log("data", data);
    if (data && state.content.content && data.id === state.content.content.id) {
      console.log("updateTargetContent");
      yield put(updateTargetContent(data));
    }

    if (data && data.id) {
      const contents : Content[] = [];
      state.task.contents.forEach(c => {
        if (c.id === data.id) {
          contents.push(data);
        } else {
          contents.push(c);
        }
      });
      console.log("update contents", contents);
      yield put(
          tasksActions.taskContentsReceived({
            contents: contents,
          })
      );
    }
  } catch (error) {
    yield put(reloadReceived(true));
  }
}

function* fetchTaskStatistics(action: PayloadAction<GetTaskStatisticsAction>) {
  try {
    const {projectIds, timezone, startDate, endDate} = action.payload;
    const data: TaskStatistics = yield call(getTaskStatistics, projectIds, timezone, startDate, endDate);
    yield put(
        tasksActions.TaskStatisticsReceived({
          projectStatistics: data,
        })
    )
  } catch (error) {
    if (error.message === 'reload') {
      yield put(reloadReceived(true));
    } else {
      yield call(message.error, `fetchTaskStatistics Error Received: ${error}`);
    }
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
    yield takeLatest(tasksActions.SampleTaskGet.type, getSampleTask),
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
    yield takeLatest(tasksActions.TaskRemoveShared.type, removeSharedTask),
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
    yield takeLatest(tasksActions.SampleTaskContentPatch.type, patchSampleContent),
    yield takeLatest(tasksActions.TaskContentDelete.type, deleteTaskContent),
    yield takeLatest(
        tasksActions.CompleteTaskContentsUpdate.type,
        completeTaskContentsUpdate
    ),
    yield takeLatest(tasksActions.getTasksByAssignee.type, getTasksByAssignee),
    yield takeLatest(tasksActions.getTasksByOrder.type, getTasksByOrder),
    yield takeLatest(
        tasksActions.getSearchCompletedTasks.type,
        getSearchCompletedTasks
    ),
    yield takeLatest(tasksActions.TasksDelete.type, deleteTasks),
    yield takeLatest(tasksActions.TasksComplete.type, completeTasks),
    yield takeLatest(tasksActions.TaskStatusSet.type, setTaskStatus),
    yield takeLatest(tasksActions.TaskPatchRevisionContents.type, patchTaskRevisionContents),
    yield takeLatest(tasksActions.GetTaskStatistics.type, fetchTaskStatistics),
  ]);
}
