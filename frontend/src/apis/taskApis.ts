import { doFetch, doPost, doDelete, doPut, doPatch } from './api-helper';
import { Task, ReminderSetting } from '../features/tasks/interface';

export const fetchTasks = (projectId: number) => {
  return doFetch(`/api/projects/${projectId}/tasks`)
    .then(res => res)
    .catch(err => {
      throw Error(err.message);
    });
};

export const getTaskById = (taskId: number) => {
  return doFetch(`/api/tasks/${taskId}`)
    .then(res => res.json())
    .catch(err => {
      throw Error(err.message);
    });
};

export const deleteTaskById = (taskId: number) => {
  return doDelete(`/api/task/${taskId}`)
    .catch(err => {
      throw Error(err.message);
    });
};

export const createTask = (projectId: number, name: string, assignedTo: string,
  dueDate?: string, dueTime?: string, duration?: number, reminderSetting?: ReminderSetting) => {
  const postBody = JSON.stringify({
    name: name,
    assignedTo: assignedTo,
    dueDate: dueDate,
    dueTime: dueTime,
    duration: duration,
    reminderSetting: reminderSetting
  });
  return doPost(`/api/projects/${projectId}/tasks`, postBody)
    .then(res => res.json())
    .catch(err => {
      throw Error(err.message);
    });
};

export const putTasks = (projectId: number, tasks: Task[]) => {
  const putBody = JSON.stringify({
    tasks: tasks,
  });
  return doPut(`/api/projects/${projectId}/tasks`, putBody)
    .catch(err => {
      throw Error(err.message);
    });
}

export const updateTask = (
  taskId: number,
  name?: string,
  assignedTo?: string,
  dueDate?: string,
  dueTime?: string,
  duration?: number,
  reminderSetting?: ReminderSetting
) => {
  const patchBody = JSON.stringify({
    name: name,
    assignedTo: assignedTo,
    dueDate: dueDate,
    dueTime: dueTime,
    duration: duration,
    reminderSetting: reminderSetting
  });
  return doPatch(`/api/tasks/${taskId}`, patchBody)
    .then(res => res.json())
    .catch(err => {
      throw Error(err);
    });
};