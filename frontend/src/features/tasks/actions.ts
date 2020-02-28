import { actions } from './reducer';
import { Task } from './interface';
export const updateTasks = (projectId: number) => actions.TasksUpdate({projectId: projectId});
export const createTask = (projectId: number, name: string) => actions.TasksCreate({projectId: projectId, name: name});
export const putTask = (projectId: number, tasks: Task[]) => actions.TaskPut({ projectId: projectId, tasks: tasks });
export const deleteTask = (taskId: number) => actions.TaskDelete({ taskId: taskId });