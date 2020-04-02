import { ProjectItem } from '../myBuJo/interface';

export interface ReminderSetting {
  date?: string;
  time?: string;
  before?: number;
}

export interface Task extends ProjectItem {
  subTasks: Task[];
  assignedTo: string;
  assignedToAvatar?: string;
  dueDate?: string;
  dueTime?: string;
  duration?: number;
  timezone: string;
  reminderSetting: ReminderSetting;
}
