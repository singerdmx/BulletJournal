import { actions } from './reducer';
export const createLabel = (name: string) =>
  actions.createLabel({ name: name });
export const deleteLabel = (labelId: number, name: string) =>
  actions.deleteLabel({ labelId: labelId, name: name });
export const patchLabel = (labelId: number, name: string) =>
  actions.patchLabel({ labelId: labelId, name: name });
export const labelsUpdate = () => actions.labelsUpdate({});
