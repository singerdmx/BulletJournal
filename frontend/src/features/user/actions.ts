import { actions } from './reducer';
import {History} from "history";
export const updateUser = (name: string) => actions.userUpdate({ name: name });
export const clearUser = () => actions.userClear({});
export const userApiErrorReceived = (error: string) => actions.userApiErrorReceived({error: error});
export const changeAlias = (targetUser: string, alias: string, groupId: number, history: History<History.PoorMansUnknown>) =>
    actions.userAliasUpdate({targetUser: targetUser, alias: alias, groupId: groupId, history: history});
