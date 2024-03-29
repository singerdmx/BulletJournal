import {TaskView} from '../tasks/interface';
import { Note } from '../notes/interface';
import {TransactionView} from '../transactions/interface';
import { Label } from '../label/interface';
import { ContentType } from '../myBuJo/constants';
import {User} from "../group/interface";

export interface ProjectItems {
  tasks: TaskView[];
  notes: Note[];
  transactions: TransactionView[];
  date: string;
  dayOfWeek: string;
}

export interface ProjectItem {
  id: number;
  name: string;
  owner: User;
  projectId: number;
  labels: Label[];
  contentType: ContentType;
  updatedAt: number;
  createdAt: number;
  shared: boolean;
  editable: boolean;
  deletable: boolean;
}

export interface Content {
  id: number;
  owner: User;
  text: string;
  etag: string;
  createdAt: number;
  updatedAt: number;
  editable: boolean;
  deletable: boolean;
  revisions: Revision[];
}

export interface Revision {
  id: number;
  createdAt: number;
  user: User;
  content?: string;
}
