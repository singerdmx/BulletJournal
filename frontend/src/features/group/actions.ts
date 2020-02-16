import { actions } from './reducer'
export const updateGroups = () => actions.groupsUpdate({});
export const createGroupByName = (name: string) => actions.createGroup({ name:name });