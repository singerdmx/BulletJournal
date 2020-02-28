import { actions } from './reducer';
import { Task, ReminderSetting } from './interface';
export const updateTasks = (projectId: number) => actions.TasksUpdate({projectId: projectId});
export const createTask = (projectId: number, name: string,
    dueDate: string, dueTime: string, reminderSetting: ReminderSetting) =>
    actions.TasksCreate({projectId: projectId, name: name,
        dueDate: dueDate, dueTime: dueTime, reminderSetting: reminderSetting });
export const putTask = (projectId: number, tasks: Task[]) => actions.TaskPut({ projectId: projectId, tasks: tasks });
export const deleteTask = (taskId: number) => actions.TaskDelete({ taskId: taskId });
export const patchTask = (taskId: number, name: string, dueDate: string, dueTime: string,
    reminderSetting: ReminderSetting) => actions.TaskPatch({ taskId: taskId, name: name,
        dueDate: dueDate, dueTime: dueTime, reminderSetting: reminderSetting });