import { actions } from './reducer';
import { Role } from './interface';

export const setRole = (username: string, role: Role) =>
  actions.setRole({ username: username, role: role });

export const getUsersByRole = (role: Role) =>
  actions.getUsersByRole({ role: role });

export const getBlockedUsersAndIPs = () => actions.getBlockedUsersAndIPs({});
