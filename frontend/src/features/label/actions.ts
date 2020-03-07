import { actions } from './reducer';
export const createLabel = (value: string) =>
  actions.createLabel({ value: value });
export const deleteLabel = (labelId: number, value: string) =>
  actions.deleteLabel({ labelId: labelId, value: value });
export const patchLabel = (labelId: number, value: string) =>
  actions.patchLabel({ labelId: labelId, value: value });
export const labelsUpdate = () => actions.labelsUpdate({});
