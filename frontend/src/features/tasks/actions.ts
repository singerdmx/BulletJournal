import { actions } from './reducer';
import { Task, ReminderSetting } from './interface';
export const updateTasks = (projectId: number) => actions.TasksUpdate({projectId: projectId});
export const createTask = (projectId: number, name: string, assignedTo: string,
    dueDate: string, dueTime: string, duration: number, reminderSetting: ReminderSetting) =>
    actions.TasksCreate({projectId: projectId, name: name, assignedTo: assignedTo,
        dueDate: dueDate, dueTime: dueTime, duration: duration, reminderSetting: reminderSetting });
export const putTask = (projectId: number, tasks: Task[]) => actions.TaskPut({ projectId: projectId, tasks: tasks });
export const deleteTask = (taskId: number) => actions.TaskDelete({ taskId: taskId });
export const patchTask = (taskId: number, name: string, assignedTo: string,
    dueDate: string, dueTime: string, duration: number,
    reminderSetting: ReminderSetting) => actions.TaskPatch({ taskId: taskId, name: name,
        assignedTo: assignedTo, dueDate: dueDate, dueTime: dueTime,
        duration: duration, reminderSetting: reminderSetting });