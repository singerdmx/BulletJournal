import { actions } from './reducer';
import { Label } from './interface';
import { ProjectItems } from '../myBuJo/interface';
export const createLabel = (value: string, icon: string) =>
  actions.createLabel({ value: value, icon: icon });
export const deleteLabel = (labelId: number, value: string) =>
  actions.deleteLabel({ labelId: labelId, value: value });
export const patchLabel = (labelId: number, value?: string, icon?: string) =>
  actions.patchLabel({ labelId: labelId, value: value, icon: icon });
export const labelsUpdate = (projectId: number | undefined) => actions.labelsUpdate({projectId: projectId});
export const projectLabelsUpdate = (projectId: number) => actions.projectLabelsUpdate({projectId: projectId});
export const setSelectedLabel = (label: Label) =>
  actions.setSelectedLabel({ label: label });
export const removeSelectedLabel = (label: Label) =>
  actions.removeSelectedLabel({ label: label });
export const getItemsByLabels = (labels: number[]) =>
  actions.getItemsByLabels({ labels: labels });
export const updateItemsByLabels = (items: ProjectItems[]) =>
  actions.itemsByLabelsReceived({ items: items });
