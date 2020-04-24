import { ProjectItem } from '../myBuJo/interface';
import {ReminderBeforeTaskText} from "../../components/settings/reducer";
import {User} from "../group/interface";

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
}

export const getReminderSettingString = (reminderSetting: ReminderSetting) => {
  if (!reminderSetting) {
    return '';
  }
  if (reminderSetting.before || reminderSetting.before === 0) {
    const s = ReminderBeforeTaskText[reminderSetting.before];
    if (reminderSetting.before === 6) {
      return s;
    }

    return `Reminder: ${s}`;
  }

  return `Reminder: ${reminderSetting.date} ${reminderSetting.time ? reminderSetting.time : ''}`;
};

