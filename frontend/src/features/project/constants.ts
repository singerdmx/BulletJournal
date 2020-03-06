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
