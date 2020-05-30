import { Task } from '../tasks/interface';
import { Note } from '../notes/interface';
import { Transaction } from '../transactions/interface';
import { Label } from '../label/interface';
import { ContentType } from '../myBuJo/constants';
import {User} from "../group/interface";

export interface ProjectItems {
  tasks: Task[];
  notes: Note[];
  transactions: Transaction[];
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
  updatedAt: number,
  createdAt: number
}

export interface Content {
  id: number;
  owner: User;
  text: string;
  createdAt: number;
  updatedAt: number;
  revisions: Revision[];
}

export interface Revision {
  id: number;
  createdAt: number;
  user: User;
  content?: string;
}
