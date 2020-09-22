import { actions } from './reducer';
import {Activity, Project} from './interface';
import { ProjectType, ContentAction } from './constants';
import { History } from 'history';
export const updateProjects = () => actions.projectsUpdate({});
export const createProjectByName = (
  description: string,
  groupId: number,
  name: string,
  projectType: ProjectType,
  history: History<History.PoorMansUnknown> | undefined
) =>
  actions.createProject({
    description: description,
    groupId: groupId,
    name: name,
    projectType: projectType,
    history: history,
  });
export const getProject = (projectId: number) =>
  actions.getProject({ projectId: projectId });
export const updateSharedProjectsOrder = (projectOwners: string[]) =>
  actions.updateSharedProjectsOrder({ projectOwners: projectOwners });
export const deleteProject = (
  projectId: number,
  name: string,
  history: History<History.PoorMansUnknown>
) =>
  actions.deleteProject({ projectId: projectId, name: name, history: history });
export const updateProject = (
  projectId: number,
  description: string,
  groupId: number,
  name: string
) =>
  actions.patchProject({
    projectId: projectId,
    description: description,
    groupId: groupId,
    name: name,
  });
export const updateProjectRelations = (projects: Project[]) =>
  actions.updateProjectRelations({ projects: projects });
export const getProjectHistory = (
  projectId: number,
  timezone: string,
  startDate: string,
  endDate: string,
  action: ContentAction,
  username: string
) =>
  actions.getProjectHistory({
    projectId: projectId,
    timezone: timezone,
    startDate: startDate,
    endDate: endDate,
    action: action,
    username: username,
  });

export const historyReceived = (activities: Activity[]) =>
  actions.historyReceived({projectHistory: activities});
