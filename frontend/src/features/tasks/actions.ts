import { actions } from './reducer';
import { Task, ReminderSetting, TaskStatus } from './interface';
import { History } from 'history';
import {ProjectItemUIType} from "../project/constants";

export const updateTasks = (projectId: number) =>
  actions.TasksUpdate({ projectId: projectId });
export const updateCompletedTasks = (projectId: number) =>
  actions.CompletedTasksUpdate({ projectId: projectId });
export const createTask = (
  projectId: number,
  name: string,
  assignees: string[],
  dueDate: string,
  dueTime: string,
  duration: number,
  reminderSetting: ReminderSetting,
  recurrenceRule: string,
  timezone: string,
  labels: number[]
) =>
  actions.TasksCreate({
    projectId: projectId,
    name: name,
    assignees: assignees,
    dueDate: dueDate,
    dueTime: dueTime,
    duration: duration,
    reminderSetting: reminderSetting,
    recurrenceRule: recurrenceRule,
    timezone: timezone,
    labels: labels,
  });

export const getTask = (taskId: number) => actions.TaskGet({ taskId: taskId });

export const getSampleTask = (taskId: number) => actions.SampleTaskGet({ taskId: taskId });

export const getCompletedTask = (taskId: number) =>
  actions.CompletedTaskGet({ taskId: taskId });
export const putTask = (projectId: number, tasks: Task[]) =>
  actions.TaskPut({ projectId: projectId, tasks: tasks });
export const deleteTask = (taskId: number, type: ProjectItemUIType) =>
  actions.TaskDelete({ taskId: taskId, type: type });
export const deleteTasks = (projectId: number, tasksId: number[], type: ProjectItemUIType) =>
  actions.TasksDelete({
    projectId: projectId,
    tasksId: tasksId,
    type: type
  });
export const completeTasks = (projectId: number, tasksId: number[], type: ProjectItemUIType) =>
  actions.TasksComplete({
    projectId: projectId,
    tasksId: tasksId,
    type: type
  });
export const deleteCompletedTask = (taskId: number) =>
  actions.CompletedTaskDelete({ taskId: taskId });
export const patchTask = (
  taskId: number,
  timezone: string,
  type: ProjectItemUIType,
  name?: string,
  assignees?: string[],
  dueDate?: string,
  dueTime?: string,
  duration?: number,
  reminderSetting?: ReminderSetting,
  recurrenceRule?: string,
  labels?: number[]
) =>
  actions.TaskPatch({
    taskId: taskId,
    timezone: timezone,
    type: type,
    name: name,
    assignees: assignees,
    dueDate: dueDate,
    dueTime: dueTime,
    duration: duration,
    reminderSetting: reminderSetting,
    recurrenceRule: recurrenceRule,
    labels: labels,
  });
export const completeTask = (taskId: number, type: ProjectItemUIType, dateTime?: string) =>
  actions.TaskComplete({ taskId: taskId, type: type, dateTime: dateTime });
export const uncompleteTask = (taskId: number) =>
  actions.TaskUncomplete({ taskId: taskId });
export const setTaskLabels = (taskId: number, labels: number[]) =>
  actions.TaskSetLabels({ taskId: taskId, labels: labels });
export const moveTask = (
  taskId: number,
  targetProject: number,
  history: History
) =>
  actions.TaskMove({
    taskId: taskId,
    targetProject: targetProject,
    history: history,
  });
export const updateTaskVisible = (visible: boolean) =>
  actions.UpdateAddTaskVisible({ visible: visible });
export const shareTask = (
  taskId: number,
  generateLink: boolean,
  targetUser?: string,
  targetGroup?: number,
  ttl?: number
) =>
  actions.TaskShare({
    taskId: taskId,
    targetUser: targetUser,
    targetGroup: targetGroup,
    generateLink: generateLink,
    ttl: ttl,
  });
export const getTaskSharables = (taskId: number) =>
  actions.TaskSharablesGet({ taskId: taskId });
export const revokeTaskSharable = (
  taskId: number,
  user?: string,
  link?: string
) => actions.TaskRevokeSharable({ taskId: taskId, user: user, link: link });
export const removeSharedTask = (taskId: number) =>
    actions.TaskRemoveShared({taskId: taskId});
export const updateTaskContents = (taskId: number, updateDisplayMore?: boolean) =>
  actions.TaskContentsUpdate({ taskId: taskId, updateDisplayMore: updateDisplayMore });
export const updateCompleteTaskContents = (taskId: number) =>
  actions.CompleteTaskContentsUpdate({ taskId: taskId });
export const updateTaskContentRevision = (
  taskId: number,
  contentId: number,
  revisionId: number
) =>
  actions.TaskContentRevisionUpdate({
    taskId: taskId,
    contentId: contentId,
    revisionId: revisionId,
  });

export const createContent = (taskId: number, text: string) =>
  actions.TaskContentCreate({ taskId: taskId, text: text });

export const deleteContent = (taskId: number, contentId: number) =>
  actions.TaskContentDelete({ taskId: taskId, contentId: contentId });
export const patchContent = (taskId: number, contentId: number, text: string, diff: string) =>
  actions.TaskContentPatch({
    taskId: taskId,
    contentId: contentId,
    text: text,
    diff: diff,
  });
export const patchSampleTaskContent = (taskId: number, contentId: number, text: string, diff: string) =>
    actions.SampleTaskContentPatch({
        taskId: taskId,
        contentId: contentId,
        text: text,
        diff: diff,
    });
export const updateLoadingCompletedTask = (loadingCompletedTask: boolean) =>
  actions.updateLoadingCompletedTask({
    loadingCompletedTask: loadingCompletedTask,
  });

export const updateCompletedTaskPageNo = (completedTaskPageNo: number) =>
  actions.updateCompletedTaskPageNo({
    completedTaskPageNo: completedTaskPageNo,
  });

export const clearCompletedTasks = () => actions.clearCompletedTasks({});

export const getTasksByAssignee = (projectId: number, assignee: string) =>
  actions.getTasksByAssignee({
    projectId: projectId,
    assignee: assignee,
  });

export const getTasksByOrder = (
  projectId: number,
  timezone: string,
  startDate?: string,
  endDate?: string
) =>
  actions.getTasksByOrder({
    projectId: projectId,
    timezone: timezone,
    startDate: startDate,
    endDate: endDate,
  });

export const getSearchCompletedTasks = (
  projectId: number,
  assignee: string,
  startDate: string,
  endDate: string,
  timezone: string
) =>
  actions.getSearchCompletedTasks({
    projectId: projectId,
    assignee: assignee,
    startDate: startDate,
    endDate: endDate,
    timezone: timezone,
  });

export const setTaskStatus = (taskId: number, taskStatus: TaskStatus, type: ProjectItemUIType) =>
  actions.TaskStatusSet({
    taskId: taskId,
    taskStatus: taskStatus,
    type: type
  });

export const patchTaskRevisionContents = (
    taskId: number,
    contentId: number,
    revisionContents: string[],
    etag: string
) => actions.TaskPatchRevisionContents({
    taskId: taskId, contentId: contentId, revisionContents: revisionContents, etag: etag});

export const taskReceived = (task: Task | undefined) => actions.taskReceived({task: task});

export const getTaskStatistics = (
    projectIds: number[],
    timezone: string,
    startDate: string,
    endDate: string
) => actions.GetTaskStatistics({
    projectIds: projectIds,
    timezone: timezone,
    startDate: startDate,
    endDate: endDate
});


