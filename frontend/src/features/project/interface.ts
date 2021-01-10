import { ProjectType, ContentAction } from './constants';
import { Group, User } from '../group/interface';

export interface ProjectSetting {
  color: string | undefined;
  autoDelete: boolean;
}

export interface Project {
  description: string;
  group: Group;
  id: number;
  name: string;
  owner: User;
  projectType: ProjectType;
  subProjects: Project[];
  shared: boolean;
  projectSetting: ProjectSetting;
}

export interface ProjectsWithOwner {
  owner: User;
  projects: Project[];
}

export interface Activity {
  originator: User;
  activity: string;
  activityTime: string;
  action: ContentAction;
  link: string;
}
