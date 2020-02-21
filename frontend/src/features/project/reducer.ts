import { createSlice, PayloadAction } from 'redux-starter-kit';
import { ProjectType } from './constants';
import { Project } from './interfaces';

export type ProjectApiErrorAction = {
  error: string;
};

export type ProjectAction = {
  project: Project;
};

export type GetProjectAction = {
  projectId: number;
};

export type UpdateProjects = {};

export type ProjectCreateAction = {
  description: string;
  name: string;
  projectType: ProjectType;
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
};

export type Projects = {
  owned: Project[];
  shared: ProjectsWithOwner[];
  sharedProjectsEtag: string;
  ownedProjectsEtag: string;
};


export type ProjectsWithOwner = {
  owner: string;
  projects: Project[];
};

let initialState = {
  owned: [] as Project[],
  shared: [] as ProjectsWithOwner[],
  project: {} as Project,
  ownedProjectsEtag: "",
  sharedProjectsEtag: ""
};

const slice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    projectsReceived: (state, action: PayloadAction<Projects>) => {
      const {
        owned,
        shared,
        ownedProjectsEtag,
        sharedProjectsEtag
      } = action.payload;
      state.owned = owned;
      state.shared = shared;

      if (ownedProjectsEtag && ownedProjectsEtag.length > 0) {
        state.ownedProjectsEtag = ownedProjectsEtag;
      }
      if (sharedProjectsEtag && sharedProjectsEtag.length > 0) {
        state.sharedProjectsEtag = sharedProjectsEtag;
      }
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
    ) => state
  }
});

export const reducer = slice.reducer;
export const actions = slice.actions;
