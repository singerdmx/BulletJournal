import { actions } from './reducer';
import { Role } from './interface';

export const setRole = (username: string, role: Role) =>
  actions.setRole({ username: username, role: role });

export const getUsersByRole = (role: Role) =>
  actions.getUsersByRole({ role: role });

export const getLockedUsersAndIPs = () => actions.getLockedUsersAndIPs({});

export const unlockUserandIP = (name: string, ip: string) =>
  actions.unlockUserandIP({ name: name, ip: ip });

export const lockUserandIP = (name: string, ip: string, reason: string) =>
  actions.lockUserandIP({ name: name, ip: ip, reason: reason });
