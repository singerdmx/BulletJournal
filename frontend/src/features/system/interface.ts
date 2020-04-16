import { Content, ProjectItem } from '../myBuJo/interface';
import { ContentType } from '../myBuJo/constants';
import { User } from '../group/interface';

export interface PublicProjectItem {
  contents: Content[];
  contentType: ContentType;
  projectItem: ProjectItem;
}

export interface ProjectItemSharables {
  users: User[];
  links: SharableLink[];
}

export interface SharableLink {
  link: string;
  expirationTime: number;
  createdAt: number;
}
