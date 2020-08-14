import {actions} from "./reducer";
import {History} from "history";

export const updateSystem = (force: boolean, history: History<History.PoorMansUnknown>) =>
    actions.systemUpdate({force: force, history: history});
export const getPublicItem = (itemId: string) => actions.fetchPublicProjectItem({itemId: itemId});
export const setSharedItemLabels = (itemId: string, labels: number[]) =>
    actions.setSharedItemLabels({itemId: itemId, labels: labels});