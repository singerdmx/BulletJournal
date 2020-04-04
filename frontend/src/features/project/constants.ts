export enum ProjectType {
  TODO = 'TODO',
  NOTE = 'NOTE',
  LEDGER = 'LEDGER'
}

export const toProjectType = (input: string) => {
  switch (input) {
    case 'TODO':
      return ProjectType.TODO;
    case 'NOTE':
      return ProjectType.NOTE;
    case 'LEDGER':
      return ProjectType.LEDGER;
  }

  return ProjectType.TODO;
};

export enum ProjectItemType {
  TASK = 'TASK',
  NOTE = 'NOTE',
  TRANSACTION = 'TRANSACTION'
}

export const getProjectItemType = (input: ProjectType) => {
  switch (input) {
    case ProjectType.TODO:
      return ProjectItemType.TASK;
    case ProjectType.NOTE:
      return ProjectItemType.NOTE;
    case ProjectType.LEDGER:
      return ProjectItemType.TRANSACTION;
  }

  return ProjectItemType.TASK;
};