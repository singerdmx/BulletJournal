import { actions } from './reducer';
export const updateProjects = () => actions.projectsUpdate({});
export const createProjectByName = (name: string) =>
  actions.createProject({ name: name });
