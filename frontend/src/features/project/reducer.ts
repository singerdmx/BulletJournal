import { createSlice, PayloadAction } from 'redux-starter-kit';
import { ProjectType, ContentAction } from './constants';
import { Project, ProjectsWithOwner, Activity } from './interface';
import { History } from 'history';

export type ProjectApiErrorAction = {
  error: string;
};

export type ProjectAction = {
  project?: Project;
};

export type GetProjectAction = {
  projectId: number;
};

export type UpdateProjects = {};

export type ProjectCreateAction = {
  description: string;
  groupId: number;
  name: string;
  projectType: ProjectType;
  history: History<History.PoorMansUnknown> | undefined;
};

export type UpdateSharedProjectsOrderAction = {
  projectOwners: string[];
};

export type PatchProjectAction = {
  projectId: number;
  description: string;
  groupId: number;
  name: string;
};

export type UpdateProjectRelationsAction = {
  projects: Project[];
};

export type DeleteProjectAction = {
  projectId: number;
  name: string;
  history: History<History.PoorMansUnknown>;
};

export type Projects = {
  owned: Project[];
  shared: ProjectsWithOwner[];
};

export type HistoryAction = {
  projectHistory: Activity[];
};

export type GetProjectHistoryAction = {
  projectId: number;
  timezone: string;
  startDate: string;
  endDate: string;
  action: ContentAction;
  username: string;
};

let initialState = {
  owned: [] as Project[],
  shared: [] as ProjectsWithOwner[],
  project: undefined as Project | undefined,
  projectHistory: [] as Activity[],
};

const slice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    historyReceived: (state, action: PayloadAction<HistoryAction>) => {
      const { projectHistory } = action.payload;
      state.projectHistory = projectHistory;
    },
    getProjectHistory: (
      state,
      action: PayloadAction<GetProjectHistoryAction>
    ) => state,
    projectsReceived: (state, action: PayloadAction<Projects>) => {
      const { owned, shared } = action.payload;
      state.owned = owned;
      state.shared = shared;
    },
    projectsApiErrorReceived: (
      state,
      action: PayloadAction<ProjectApiErrorAction>
    ) => state,
    projectsUpdate: (state, action: PayloadAction<UpdateProjects>) => state,
    createProject: (state, action: PayloadAction<ProjectCreateAction>) => state,
    getProject: (state, action: PayloadAction<GetProjectAction>) => state,
    projectReceived: (state, action: PayloadAction<ProjectAction>) => {
      const { project } = action.payload;
      state.project = project;
    },
    updateSharedProjectsOrder: (
      state,
      action: PayloadAction<UpdateSharedProjectsOrderAction>
    ) => state,
    deleteProject: (state, action: PayloadAction<DeleteProjectAction>) => state,
    patchProject: (state, action: PayloadAction<PatchProjectAction>) => state,
    updateProjectRelations: (
      state,
      action: PayloadAction<UpdateProjectRelationsAction>
    ) => state,
  },
});

export const reducer = slice.reducer;
export const actions = slice.actions;
