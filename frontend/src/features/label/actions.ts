import { actions } from './reducer';
export const createLabel = (value: string) =>
  actions.createLabel({ value: value });
export const deleteLabel = (labelId: number, value: string) =>
  actions.deleteLabel({ labelId: labelId, value: value });
export const patchLabel = (labelId: number, value: string) =>
  actions.patchLabel({ labelId: labelId, value: value });
export const labelsUpdate = () => actions.labelsUpdate({});
export const addSelectedLabel = (val: string) =>
  actions.addSelectedLabel( {val: val});
export const removeSelectedLabel = (val: string) =>
  actions.removeSelectedLabel( {val: val});
