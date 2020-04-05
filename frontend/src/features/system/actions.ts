import {actions} from "./reducer";

export const updateSystem = () => actions.systemUpdate({});
export const getPublicItem = (itemId: string) => actions.fetchPublicProjectItem({itemId: itemId});