import { doFetch, doPost, doDelete, doPut } from './api-helper';
import { Task } from '../features/tasks/interface';
import TaskList from '../components/task-list/task-list.component';

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

export const createTask = (projectId: number, name: string) => {
  const postBody = JSON.stringify({
    name: name,
    projectId: projectId
  });
  return doPost(`/api/projects/${projectId}/tasks`, postBody)
    .then(res => res.json())
    .catch(err => {
      throw Error(err.message);
    });
};

export const putTasks = (projectId: number, tasks: Task[]) => {
  const putBody = JSON.stringify({
    tasks: TaskList,
  });
  return doPut(`/api/projects/${projectId}/tasks`, putBody)
    .catch(err => {
      throw Error(err.message);
    });
}