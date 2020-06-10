import { ProjectItem } from '../myBuJo/interface';
import { ReminderBeforeTaskText } from '../../components/settings/reducer';
import { User } from '../group/interface';

export interface ReminderSetting {
  date?: string;
  time?: string;
  before?: number;
}

export interface Task extends ProjectItem {
  subTasks: Task[];
  assignees: User[];
  dueDate?: string;
  dueTime?: string;
  duration?: number;
  timezone: string;
  reminderSetting: ReminderSetting;
  recurrenceRule: string;
  status: TaskStatus;
}

export enum TaskStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  NEXT_TO_DO = 'NEXT_TO_DO',
  READY = 'READY',
  ON_HOLD = 'ON_HOLD',
}

export const getReminderSettingString = (reminderSetting: ReminderSetting) => {
  if (!reminderSetting) {
    return 'No Reminder';
  }

  if (reminderSetting.before || reminderSetting.before === 0) {
    const s = ReminderBeforeTaskText[reminderSetting.before];
    if (reminderSetting.before === 6) {
      return s;
    }

    return `Reminder: ${s}`;
  }

  if (!reminderSetting.date) {
    return 'No Reminder';
  }

  return `Reminder: ${reminderSetting.date} ${
    reminderSetting.time ? reminderSetting.time : ''
  }`;
};
