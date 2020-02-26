import { ProjectType } from './constants';
import { Group } from '../group/interfaces';
export interface Project {
  description: string;
  group: Group;
  id: number;
  name: string;
  owner: string;
  projectType: ProjectType;
  subProjects: Project[];
};

export interface ProjectsWithOwner {
  owner: string;
  projects: Project[];
};