import { actions } from './reducer';
import { Task, ReminderSetting } from './interface';
import { History } from 'history';

export const updateTasks = (projectId: number) =>
  actions.TasksUpdate({ projectId: projectId });
export const updateCompletedTasks = (projectId: number) =>
  actions.CompletedTasksUpdate({ projectId: projectId });
export const createTask = (
  projectId: number,
  name: string,
  assignedTo: string,
  assignees: string[],
  dueDate: string,
  dueTime: string,
  duration: number,
  reminderSetting: ReminderSetting,
  recurrenceRule: string,
  timezone: string
) =>
  actions.TasksCreate({
    projectId: projectId,
    name: name,
    assignedTo: assignedTo,
    assignees: assignees,
    dueDate: dueDate,
    dueTime: dueTime,
    duration: duration,
    reminderSetting: reminderSetting,
    recurrenceRule: recurrenceRule,
    timezone: timezone,
  });
export const getTask = (taskId: number) => actions.TaskGet({ taskId: taskId });
export const getCompletedTask = (taskId: number) =>
  actions.CompletedTaskGet({ taskId: taskId });
export const putTask = (projectId: number, tasks: Task[]) =>
  actions.TaskPut({ projectId: projectId, tasks: tasks });
export const deleteTask = (taskId: number) =>
  actions.TaskDelete({ taskId: taskId });
export const deleteCompletedTask = (taskId: number) =>
  actions.CompletedTaskDelete({ taskId: taskId });
export const patchTask = (
  taskId: number,
  timezone: string,
  name?: string,
  assignedTo?: string,
  assignees?: string[],
  dueDate?: string,
  dueTime?: string,
  duration?: number,
  reminderSetting?: ReminderSetting,
  recurrenceRule?: string
) =>
  actions.TaskPatch({
    taskId: taskId,
    timezone: timezone,
    name: name,
    assignedTo: assignedTo,
    assignees: assignees,
    dueDate: dueDate,
    dueTime: dueTime,
    duration: duration,
    reminderSetting: reminderSetting,
    recurrenceRule: recurrenceRule,
  });
export const completeTask = (taskId: number, dateTime?: string) =>
  actions.TaskComplete({ taskId: taskId, dateTime: dateTime });
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
export const updateTaskContents = (taskId: number) =>
  actions.TaskContentsUpdate({ taskId: taskId });
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
export const patchContent = (taskId: number, contentId: number, text: string) =>
  actions.TaskContentPatch({
    taskId: taskId,
    contentId: contentId,
    text: text,
  });
