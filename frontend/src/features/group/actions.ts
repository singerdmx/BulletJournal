import { actions } from './reducer';
export const updateGroups = () => actions.groupsUpdate({});
export const createGroupByName = (name: string) =>
  actions.createGroup({ name: name });
export const addUserGroupByUsername = (groupId: number, username: string) =>
  actions.addUserGroup({ groupId: groupId, username: username });
export const removeUserGroupByUsername = (groupId: number, username: string) =>
  actions.removeUserGroup({ groupId: groupId, username: username });
export const deleteGroup = (groupId: number, groupName: string) =>
  actions.deleteGroup({ groupId: groupId, groupName: groupName });
export const getGroup = (groupId: number) =>
  actions.getGroup({ groupId: groupId });
export const patchGroup = (groupId: number, name: string) =>
  actions.patchGroup({ groupId: groupId, name: name });
