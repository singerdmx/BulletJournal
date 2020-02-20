import { actions, ProjectType } from './reducer';
export const updateProjects = () => actions.projectsUpdate({});
export const createProjectByName = (
  description: string,
  name: string,
  projectType: ProjectType
) =>
  actions.createProject({
    description: description,
    name: name,
    projectType: projectType
  });
export const getProject = (projectId: number) =>
  actions.getProject({ projectId: projectId });
