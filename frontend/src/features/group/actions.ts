import { actions } from './reducer';
export const updateGroups = () => actions.groupsUpdate({});
export const createGroupByName = (name: string) =>
  actions.createGroup({ name: name });
export const addUserGroupByUsername = (groupId: number, username: string) =>
  actions.addUserGroup({ groupId: groupId, username: username });
export const removeUserGroupByUsername = (groupId: number, username: string) =>
  actions.removeUserGroup({ groupId: groupId, username: username });
export const deleteGroup = (groupId: number) =>
  actions.deleteGroup({groupId: groupId});
export const getGroup = (groupId: number) =>
  actions.getGroup({groupId: groupId});