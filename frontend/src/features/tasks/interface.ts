export interface ReminderSetting {
    date: string,
    time: string,
    before: number
}

export interface Task {
    id: number,
    name: string,
    projectId: number,
    subTasks: Task[],
    assignedTo: string,
    dueDate: string,
    dueTime: string,
    timezone: string,
    reminderSetting: ReminderSetting
}