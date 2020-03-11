import { actions } from './reducer';
export const createLabel = (value: string, icon: string) =>
  actions.createLabel({ value: value, icon: icon });
export const deleteLabel = (labelId: number, value: string) =>
  actions.deleteLabel({ labelId: labelId, value: value });
export const patchLabel = (labelId: number, value?: string, icon?: string) =>
  actions.patchLabel({ labelId: labelId, value: value, icon: icon });
export const labelsUpdate = () => actions.labelsUpdate({});
export const addSelectedLabel = (val: string) =>
  actions.addSelectedLabel({val: val});
export const removeSelectedLabel = (val: string) =>
  actions.removeSelectedLabel({val: val});
export const getItemsByLabels = (labels: number[]) =>
  actions.getItemsByLabels({labels: labels});