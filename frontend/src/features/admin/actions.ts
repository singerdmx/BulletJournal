import { actions } from './reducer';
import { Role } from './interface';

export const setRole = (username: string, role: Role) =>
  actions.setRole({ username: username, role: role });

export const changePoints = (username: string, points: number) =>
  actions.changePoints({ username: username, points: points });

export const setPoints = (username: string, points: number) =>
  actions.setPoints({ username: username, points: points });

export const userInfoPointsReceived = (points: number) =>
  actions.userInfoPointsReceived({ points: points });

export const getUsersByRole = (role: Role) =>
  actions.getUsersByRole({ role: role });

export const getLockedUsersAndIPs = () => actions.getLockedUsersAndIPs({});

export const unlockUserandIP = (name: string, ip: string) =>
  actions.unlockUserandIP({ name: name, ip: ip });

export const lockUserandIP = (name: string, ip: string, reason: string) =>
  actions.lockUserandIP({ name: name, ip: ip, reason: reason });

export const getUserInfo = (username: string) =>
  actions.getUserInfo({ username: username });
