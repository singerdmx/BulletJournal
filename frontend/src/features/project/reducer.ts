import { createSlice, PayloadAction } from 'redux-starter-kit';

export type ProjectApiErrorAction = {
  error: string;
};

export type UpdateProjects = {};

export type ProjectCreateAction = {
  name: string;
};

export type Group = {
  id: number;
  name: string;
  owner: string;
};

export type Projects = {
  owned: Project[];
  shared: ProjectsWithOwner[];
};

export type Project = {
  description: string;
  group: Group;
  id: number;
  name: string;
  owner: string;
  projectType: string;
  subProjects: Project[];
};

export type ProjectsWithOwner = {
  owner: string;
  projects: Project[];
};

let initialState = {
  owned: [] as Project[],
  shared: [] as ProjectsWithOwner[]
};

const slice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
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
    createProject: (state, action: PayloadAction<ProjectCreateAction>) => state
  }
});

export const updateProjects = () => actions.projectsUpdate({});

export const reducer = slice.reducer;
export const actions = slice.actions;
