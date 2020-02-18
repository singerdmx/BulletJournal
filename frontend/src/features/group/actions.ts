import { actions } from './reducer';
export const updateGroups = () => actions.groupsUpdate({});
export const createGroupByName = (name: string) =>
  actions.createGroup({ name: name });
export const addUserGroupByUsername = (groupId: number, username: string) =>
  actions.addUserGroup({ groupId: groupId, username: username });
export const removeUserGroupByUsername = (groupId: number, username: string) =>
  actions.removeUserGroup({ groupId: groupId, username: username });
