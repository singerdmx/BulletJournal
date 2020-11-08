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
  reminderDateTime?: number;
}

export interface TaskView extends Task {
  startTime?: number;
  endTime?: number;
}

export interface TaskStatistics {
  completed: number;
  uncompleted: number;
  userTaskStatistics: UserTaskStatistic[];
}

export interface UserTaskStatistic {
  user: User;
  completed: number;
  uncompleted: number;
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

export const getTaskBackgroundColor = (
  taskStatus: TaskStatus,
  theme: string
) => {
  if (!taskStatus) return {};

  switch (theme) {
    case 'LIGHT':
    case 'PINK':
      switch (taskStatus) {
        case TaskStatus.IN_PROGRESS: {
          return {
            backgroundColor: '#e6f5ff',
          };
        }
        case TaskStatus.NEXT_TO_DO: {
          return {
            backgroundColor: '#ffebe6',
          };
        }
        case TaskStatus.ON_HOLD: {
          return {
            backgroundColor: '#CFD1DB',
          };
        }
        case TaskStatus.READY: {
          return {
            backgroundColor: '#e6ffe6',
          };
        }
      }
      break;
    case 'DARK':
      switch (taskStatus) {
        case TaskStatus.IN_PROGRESS: {
          return {
            backgroundColor: '#000f1a',
          };
        }
        case TaskStatus.NEXT_TO_DO: {
          return {
            backgroundColor: '#330a00',
          };
        }
        case TaskStatus.ON_HOLD: {
          return {
            backgroundColor: '#404040',
          };
        }
        case TaskStatus.READY: {
          return {
            backgroundColor: '#001a00',
          };
        }
      }
  }
};
