import { actions } from './reducer';
import {History} from "history";
export const updateGroups = () => actions.groupsUpdate({});
export const createGroupByName = (name: string) =>
  actions.createGroup({ name: name });
export const addUserGroupByUsername = (
  groupId: number,
  username: string,
  groupName: string
) =>
  actions.addUserGroup({
    groupId: groupId,
    username: username,
    groupName: groupName
  });
export const removeUserGroupByUsername = (
  groupId: number,
  username: string,
  groupName: string
) =>
  actions.removeUserGroup({
    groupId: groupId,
    username: username,
    groupName: groupName
  });
export const deleteGroup = (groupId: number, groupName: string, history: History<History.PoorMansUnknown>) =>
  actions.deleteGroup({ groupId: groupId, groupName: groupName, history: history });
export const getGroup = (groupId: number) =>
  actions.getGroup({ groupId: groupId });
export const patchGroup = (groupId: number, name: string) =>
  actions.patchGroup({ groupId: groupId, name: name });
export const groupUpdate = () => actions.groupUpdate({});
