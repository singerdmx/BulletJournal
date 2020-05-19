export enum ProjectType {
  TODO = 'TODO',
  NOTE = 'NOTE',
  LEDGER = 'LEDGER',
}

export const toProjectType = (input: string) => {
  switch (input) {
    case 'TODO':
      return ProjectType.TODO;
    case 'NOTE':
      return ProjectType.NOTE;
    case 'LEDGER':
      return ProjectType.LEDGER;
    default:
      return ProjectType.TODO;
  }
};

export enum ProjectItemType {
  TASK = 'TASK',
  NOTE = 'NOTE',
  TRANSACTION = 'TRANSACTION',
}

export const getProjectItemType = (input: ProjectType) => {
  switch (input) {
    case ProjectType.TODO:
      return ProjectItemType.TASK;
    case ProjectType.NOTE:
      return ProjectItemType.NOTE;
    case ProjectType.LEDGER:
      return ProjectItemType.TRANSACTION;
    default:
      return ProjectItemType.TASK;
  }
};

export enum ContentAction {
  ADD_PROJECT = 'ADD_PROJECT',
  DELETE_PROJECT = 'DELETE_PROJECT',
  UPDATE_PROJECT = 'UPDATE_PROJECT',
  ADD_TASK = 'ADD_TASK',
  DELETE_TASK = 'DELETE_TASK',
  UPDATE_TASK = 'UPDATE_TASK',
  ADD_NOTE = 'ADD_NOTE',
  DELETE_NOTE = 'DELETE_NOTE',
  UPDATE_NOTE = 'UPDATE_NOTE',
  ADD_TRANSACTION = 'ADD_TRANSACTION',
  DELETE_TRANSACTION = 'DELETE_TRANSACTION',
  UPDATE_TRANSACTION = 'UPDATE_TRANSACTION',
  ADD_CONTENT = 'ADD_CONTENT',
  DELETE_CONTENT = 'DELETE_CONTENT',
  UPDATE_CONTENT = 'UPDATE_CONTENT',
}

export const completedTaskPageSize = 50;
