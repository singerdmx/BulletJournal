import {Choice, Rule, SampleTask, Selection, Step} from "../templates/interface";

export enum Role {
  BASIC = 'BASIC',
  MEMBER = 'MEMBER',
  REGULAR = 'REGULAR',
  MODERATOR = 'MODERATOR',
  ADMIN = 'ADMIN',
}

export interface LockedUser {
  name: string;
  reason: string;
  expiration: number;
  expirationInHour: number;
}

export interface LockedIP {
  ip: string;
  reason: string;
  expiration: number;
  expirationInHour: number;
}

export interface UserInfo {
  id: number;
  name: string;
  timezone: string;
  currency: string;
  theme: string;
  points: number;
}

interface Connection {
  left: Step;
  right: Step;
  middle?: Rule;
}

export interface SampleTaskRule {
  step: Step;
  selectionCombo: string;
  taskIds: string;
  tasks: SampleTask[];
  selections: Selection[];
}

export interface CategorySteps {
  connections: Connection[];
  stepIds: number[];
  finalSteps: SampleTaskRule[];
}

export interface ChoiceMetadata {
  keyword: string;
  choice: Choice;
}

export interface SelectionMetadata {
  keyword: string;
  selection: Selection;
  frequency?: number;
}

export interface StepMetadata {
  keyword: string;
  step: Step;
}