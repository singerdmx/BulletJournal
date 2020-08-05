import {actions} from "./reducer";

export const updateSystem = (force: boolean) => actions.systemUpdate({force: force});
export const getPublicItem = (itemId: string) => actions.fetchPublicProjectItem({itemId: itemId});
export const setSharedItemLabels = (itemId: string, labels: number[]) =>
    actions.setSharedItemLabels({itemId: itemId, labels: labels});