import { createSlice, PayloadAction } from 'redux-starter-kit';
import { Task, ReminderSetting } from './interface';

export type TaskApiErrorAction = {
  error: string;
};

export type UpdateTasks = {
  projectId: number;
};

export type CreateTask = {
  projectId: number;
  name: string;
  assignedTo: string;
  reminderSetting: ReminderSetting;
  dueDate?: string;
  dueTime?: string;
  duration?: number;
  recurrenceRule?: string;
};

export type GetTask = {
  taskId: number;
};

export type TasksAction = {
  tasks: Array<Task>;
};

export type PutTask = {
  projectId: number;
  tasks: Task[];
};

export type DeleteTask = {
  taskId: number;
};

export type PatchTask = {
  taskId: number;
  name?: string;
  assignedTo?: string;
  dueDate?: string;
  dueTime?: string;
  duration?: number;
  reminderSetting?: ReminderSetting;
};

export type CompleteTask = {
  taskId: number;
};

export type UncompleteTask = {
  taskId: number;
};

export type SetTaskLabels = {
  taskId: number;
  labels: number[];
};

export type GetCompletedTasks = {
  projectId: number;
};

let initialState = {
  tasks: [] as Array<Task>,
  completedTasks: [] as Array<Task>
};

const slice = createSlice({
  name: 'task',
  initialState,
  reducers: {
    tasksReceived: (state, action: PayloadAction<TasksAction>) => {
      const { tasks } = action.payload;
      state.tasks = tasks;
    },
    completedTasksReceived: (state, action: PayloadAction<TasksAction>) => {
      const { tasks } = action.payload;
      state.completedTasks = tasks;
    },
    taskApiErrorReceived: (state, action: PayloadAction<TaskApiErrorAction>) =>
      state,
    TasksUpdate: (state, action: PayloadAction<UpdateTasks>) => state,
    CompletedTasksUpdate: (state, action: PayloadAction<UpdateTasks>) => state,
    TasksCreate: (state, action: PayloadAction<CreateTask>) => state,
    TaskPut: (state, action: PayloadAction<PutTask>) => state,
    TaskGet: (state, action: PayloadAction<GetTask>) => state,
    TaskDelete: (state, action: PayloadAction<DeleteTask>) => state,
    TaskPatch: (state, action: PayloadAction<PatchTask>) => state,
    TaskComplete: (state, action: PayloadAction<CompleteTask>) => state,
    TaskUncomplete: (state, action: PayloadAction<UncompleteTask>) => state,
    TaskSetLabels: (state, action: PayloadAction<SetTaskLabels>) => state
  }
});

export const reducer = slice.reducer;
export const actions = slice.actions;
