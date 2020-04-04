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
    dueDate: dueDate,
    dueTime: dueTime,
    duration: duration,
    reminderSetting: reminderSetting,
    recurrenceRule: recurrenceRule,
    timezone: timezone,
  });
export const getTask = (taskId: number) => actions.TaskGet({ taskId: taskId });
export const putTask = (projectId: number, tasks: Task[]) =>
  actions.TaskPut({ projectId: projectId, tasks: tasks });
export const deleteTask = (taskId: number) =>
  actions.TaskDelete({ taskId: taskId });
export const deleteCompletedTask = (taskId: number) =>
  actions.CompletedTaskDelete({ taskId: taskId });
export const patchTask = (
  taskId: number,
  name: string,
  assignedTo: string,
  dueDate: string,
  dueTime: string,
  duration: number,
  timezone: string,
  reminderSetting: ReminderSetting,
  recurrenceRule: string
) =>
  actions.TaskPatch({
    taskId: taskId,
    name: name,
    assignedTo: assignedTo,
    dueDate: dueDate,
    dueTime: dueTime,
    duration: duration,
    timezone: timezone,
    reminderSetting: reminderSetting,
    recurrenceRule: recurrenceRule,
  });
export const completeTask = (taskId: number) =>
  actions.TaskComplete({ taskId: taskId });
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
  targetUser: string,
  targetGroup: number,
  generateLink: boolean
) =>
  actions.TaskShare({
    taskId: taskId,
    targetUser: targetUser,
    targetGroup: targetGroup,
    generateLink: generateLink,
  });
