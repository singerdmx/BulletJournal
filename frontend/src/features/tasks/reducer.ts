import { createSlice, PayloadAction } from 'redux-starter-kit';
import {Task, ReminderSetting, TaskStatus, TaskStatistics} from './interface';
import { History } from 'history';
import { User } from '../group/interface';
import { Content } from '../myBuJo/interface';
import { ProjectItemSharables, SharableLink } from '../system/interface';
import {ProjectItemUIType} from "../project/constants";

export type TaskApiErrorAction = {
  error: string;
};

export type UpdateTaskContents = {
  taskId: number;
  updateDisplayMore?: boolean;
};

export type UpdateTaskContentRevision = {
  taskId: number;
  contentId: number;
  revisionId: number;
};

export type UpdateTasks = {
  projectId: number;
};

export type GetTasksByAssignee = {
  projectId: number;
  assignee: string;
};

export type TasksByAssigneeAction = {
  tasksByAssignee: Array<Task>;
};

export type UpdateCompletedTasks = {
  projectId: number;
};

export type CreateTask = {
  projectId: number;
  name: string;
  assignees: string[];
  reminderSetting: ReminderSetting;
  timezone: string;
  dueDate?: string;
  dueTime?: string;
  duration?: number;
  recurrenceRule?: string;
  labels?: number[];
};

export type ContentsAction = {
  contents: Content[];
};

export type DeleteContent = {
  taskId: number;
  contentId: number;
};

export type GetTask = {
  taskId: number;
};

export type TasksAction = {
  tasks: Array<Task>;
};

export type ClearCompletedTasksAction = {};

export type TaskAction = {
  task: Task | undefined;
};

export type CreateContent = {
  taskId: number;
  text: string;
};

export type PutTask = {
  projectId: number;
  tasks: Task[];
};

export type DeleteTask = {
  taskId: number;
  type: ProjectItemUIType;
};

export type DeleteCompleteTask = {
  taskId: number;
};

export type DeleteTasks = {
  projectId: number;
  tasksId: number[];
  type: ProjectItemUIType;
};

export type CompleteTasks = {
  projectId: number;
  tasksId: number[];
  type: ProjectItemUIType;
};

export type MoveTask = {
  taskId: number;
  targetProject: number;
  history: History;
};

export type ShareTask = {
  targetUser?: string;
  taskId: number;
  targetGroup?: number;
  generateLink: boolean;
  ttl?: number;
};

export type GetSharables = {
  taskId: number;
};

export type PatchContent = {
  taskId: number;
  contentId: number;
  text: string;
  diff: string;
  mdiff?: string;
};

export type RevokeSharable = {
  taskId: number;
  user?: string;
  link?: string;
};

export type RemoveShared = {
  taskId: number;
};

export type PatchTask = {
  taskId: number;
  timezone: string;
  type: ProjectItemUIType;
  name?: string;
  assignees?: string[];
  dueDate?: string;
  dueTime?: string;
  duration?: number;
  reminderSetting?: ReminderSetting;
  recurrenceRule?: string;
  labels?: number[];
};

export type CompleteTask = {
  taskId: number;
  type: ProjectItemUIType;
  dateTime?: string;
};

export type UncompleteTask = {
  taskId: number;
};

export type SetTaskLabels = {
  taskId: number;
  labels: number[];
};

export type updateVisibleAction = {
  visible: boolean;
};

export type ShareLinkAction = {
  link: string;
};

export type LoadingCompletedTaskAction = {
  loadingCompletedTask: boolean;
};

export type UpdateCompletedTaskPageNoAction = {
  completedTaskPageNo: number;
};

export type GetTasksByOrder = {
  projectId: number;
  timezone: string;
  startDate?: string;
  endDate?: string;
};

export type TasksByOrderAction = {
  tasksByOrder: Array<Task>;
};

export type SearchCompletedTasks = {
  searchCompletedTasks: Array<Task>;
};

export type GetSearchCompletedTasks = {
  projectId: number;
  assignee: string;
  startDate: string;
  endDate: string;
  timezone: string;
};

export type SetTaskStatus = {
  taskId: number;
  taskStatus: TaskStatus;
  type: ProjectItemUIType;
};

export type PatchRevisionContents = {
  taskId: number;
  contentId: number;
  revisionContents: string[];
  etag: string;
}

export type GetTaskStatisticsAction = {
  projectIds: number[];
  timezone: string;
  startDate: string;
  endDate: string;
}

export type TaskStatisticsAction = {
  projectStatistics: TaskStatistics;
}

let initialState = {
  addTaskVisible: false,
  contents: [] as Array<Content>,
  task: undefined as Task | undefined,
  tasks: [] as Array<Task>,
  completedTasks: [] as Array<Task>,
  nextCompletedTasks: [] as Array<Task>,
  sharedUsers: [] as User[],
  sharedLinks: [] as SharableLink[],
  sharedLink: '',
  loadingCompletedTask: false as boolean,
  completedTaskPageNo: 0,
  tasksByAssignee: [] as Array<Task>,
  tasksByOrder: [] as Array<Task>,
  searchCompletedTasks: [] as Array<Task>,
  projectStatistics: undefined as TaskStatistics | undefined,
};

const slice = createSlice({
  name: 'task',
  initialState,
  reducers: {
    searchCompletedTasksReceived: (
      state,
      action: PayloadAction<SearchCompletedTasks>
    ) => {
      const { searchCompletedTasks } = action.payload;
      state.searchCompletedTasks = searchCompletedTasks;
    },
    getSearchCompletedTasks: (
      state,
      action: PayloadAction<GetSearchCompletedTasks>
    ) => state,
    tasksByOrderReceived: (
      state,
      action: PayloadAction<TasksByOrderAction>
    ) => {
      const { tasksByOrder } = action.payload;
      state.tasksByOrder = tasksByOrder;
    },
    getTasksByOrder: (state, action: PayloadAction<GetTasksByOrder>) => state,
    tasksByAssigneeReceived: (
      state,
      action: PayloadAction<TasksByAssigneeAction>
    ) => {
      const { tasksByAssignee } = action.payload;
      state.tasksByAssignee = tasksByAssignee;
    },
    getTasksByAssignee: (state, action: PayloadAction<GetTasksByAssignee>) =>
      state,
    tasksReceived: (state, action: PayloadAction<TasksAction>) => {
      const { tasks } = action.payload;
      state.tasks = tasks;
    },
    taskReceived: (state, action: PayloadAction<TaskAction>) => {
      const { task } = action.payload;
      state.task = task;
    },
    updateCompletedTaskPageNo: (
      state,
      action: PayloadAction<UpdateCompletedTaskPageNoAction>
    ) => {
      const { completedTaskPageNo } = action.payload;
      state.completedTaskPageNo = completedTaskPageNo;
    },
    updateLoadingCompletedTask: (
      state,
      action: PayloadAction<LoadingCompletedTaskAction>
    ) => {
      const { loadingCompletedTask } = action.payload;
      state.loadingCompletedTask = loadingCompletedTask;
    },
    taskSharablesReceived: (
      state,
      action: PayloadAction<ProjectItemSharables>
    ) => {
      const { users, links } = action.payload;
      state.sharedUsers = users;
      state.sharedLinks = links;
    },
    sharedLinkReceived: (state, action: PayloadAction<ShareLinkAction>) => {
      const { link } = action.payload;
      state.sharedLink = link;
    },
    UpdateAddTaskVisible: (
      state,
      action: PayloadAction<updateVisibleAction>
    ) => {
      const { visible } = action.payload;
      state.addTaskVisible = visible;
    },
    completedTasksReceived: (state, action: PayloadAction<TasksAction>) => {
      const { tasks } = action.payload;
      state.completedTasks = tasks;
    },
    clearCompletedTasks: (
      state,
      action: PayloadAction<ClearCompletedTasksAction>
    ) => {
      state.completedTasks = [];
      state.nextCompletedTasks = [];
      state.completedTaskPageNo = 0;
    },
    nextCompletedTasksReceived: (state, action: PayloadAction<TasksAction>) => {
      const { tasks } = action.payload;
      state.nextCompletedTasks = tasks;
    },
    taskApiErrorReceived: (state, action: PayloadAction<TaskApiErrorAction>) =>
      state,
    TasksUpdate: (state, action: PayloadAction<UpdateTasks>) => state,
    CompletedTasksUpdate: (
      state,
      action: PayloadAction<UpdateCompletedTasks>
    ) => state,
    TasksCreate: (state, action: PayloadAction<CreateTask>) => state,
    TaskPut: (state, action: PayloadAction<PutTask>) => state,
    TaskGet: (state, action: PayloadAction<GetTask>) => state,
    SampleTaskGet: (state, action: PayloadAction<GetTask>) => state,
    CompletedTaskGet: (state, action: PayloadAction<GetTask>) => state,
    TaskDelete: (state, action: PayloadAction<DeleteTask>) => state,
    TasksDelete: (state, action: PayloadAction<DeleteTasks>) => state,
    TasksComplete: (state, action: PayloadAction<CompleteTasks>) => state,
    CompletedTaskDelete: (state, action: PayloadAction<DeleteCompleteTask>) => state,
    TaskPatch: (state, action: PayloadAction<PatchTask>) => state,
    TaskComplete: (state, action: PayloadAction<CompleteTask>) => state,
    TaskUncomplete: (state, action: PayloadAction<UncompleteTask>) => state,
    TaskSetLabels: (state, action: PayloadAction<SetTaskLabels>) => state,
    TaskMove: (state, action: PayloadAction<MoveTask>) => state,
    TaskShare: (state, action: PayloadAction<ShareTask>) => state,
    TaskSharablesGet: (state, action: PayloadAction<GetSharables>) => state,
    TaskRevokeSharable: (state, action: PayloadAction<RevokeSharable>) => state,
    TaskRemoveShared: (state, action: PayloadAction<RemoveShared>) => state,
    taskContentsReceived: (state, action: PayloadAction<ContentsAction>) => {
      const { contents } = action.payload;
      state.contents = contents;
    },
    TaskContentsUpdate: (state, action: PayloadAction<UpdateTaskContents>) =>
      state,
    CompleteTaskContentsUpdate: (
      state,
      action: PayloadAction<UpdateTaskContents>
    ) => state,
    TaskContentRevisionUpdate: (
      state,
      action: PayloadAction<UpdateTaskContentRevision>
    ) => state,
    TaskContentCreate: (state, action: PayloadAction<CreateContent>) => state,
    TaskContentDelete: (state, action: PayloadAction<DeleteContent>) => state,
    TaskContentPatch: (state, action: PayloadAction<PatchContent>) => state,
    SampleTaskContentPatch: (state, action: PayloadAction<PatchContent>) => state,
    TaskStatusSet: (state, action: PayloadAction<SetTaskStatus>) => state,
    TaskPatchRevisionContents: (state, action: PayloadAction<PatchRevisionContents>) => state,
    GetTaskStatistics: (state, action: PayloadAction<GetTaskStatisticsAction>) => state,
    TaskStatisticsReceived: (state, action: PayloadAction<TaskStatisticsAction>) => {
      const { projectStatistics } = action.payload;
      state.projectStatistics = projectStatistics;
    },
  },
});

export const reducer = slice.reducer;
export const actions = slice.actions;
