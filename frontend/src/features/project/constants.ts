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
  ALL_ACTIONS = 'ALL ACTIONS',
  ADD_PROJECT = 'ADD PROJECT',
  DELETE_PROJECT = 'DELETE PROJECT',
  UPDATE_PROJECT = 'UPDATE PROJECT',
  ADD_TASK = 'ADD TASK',
  DELETE_TASK = 'DELETE TASK',
  UPDATE_TASK = 'UPDATE TASK',
  ADD_NOTE = 'ADD NOTE',
  DELETE_NOTE = 'DELETE NOTE',
  UPDATE_NOTE = 'UPDATE NOTE',
  ADD_TRANSACTION = 'ADD TRANSACTION',
  DELETE_TRANSACTION = 'DELETE TRANSACTION',
  UPDATE_TRANSACTION = 'UPDATE TRANSACTION',
  ADD_CONTENT = 'ADD CONTENT',
  DELETE_CONTENT = 'DELETE CONTENT',
  UPDATE_CONTENT = 'UPDATE CONTENT',
}

export const completedTaskPageSize = 50;
