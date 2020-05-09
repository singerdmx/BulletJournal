import { actions } from './reducer';
export const updateUser = (name: string) => actions.userUpdate({ name: name });
export const clearUser = () => actions.userClear({});
export const userApiErrorReceived = (error: string) => actions.userApiErrorReceived({error: error});
export const changeAlias = (targetUser: string, alias: string) => actions.userAliasUpdate({targetUser: targetUser, alias: alias});
