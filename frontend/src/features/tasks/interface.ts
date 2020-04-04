import { ProjectItem } from '../myBuJo/interface';
import {ReminderBeforeTaskText} from "../../components/settings/reducer";

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
  recurrenceRule: string;
}

export const getReminderSettingString = (reminderSetting: ReminderSetting) => {
  if (reminderSetting.before || reminderSetting.before === 0) {
    const s = ReminderBeforeTaskText[reminderSetting.before];
    if (reminderSetting.before === 6) {
      return s;
    }

    return `Reminder: ${s}`;
  }

  return `Reminder: ${reminderSetting.date} ${reminderSetting.time ? reminderSetting.time : ''}`;
};

