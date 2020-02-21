import { ProjectType } from './constants';
export interface Project {
    description: string;
    group: Group;
    id: number;
    name: string;
    owner: string;
    projectType: ProjectType;
    subProjects: Project[];
  };

  export interface Group {
    id: number;
    name: string;
    owner: string;
  };