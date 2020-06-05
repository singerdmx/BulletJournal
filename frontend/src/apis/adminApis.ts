import { Role } from '../features/admin/interface';
import { doPost, doFetch } from './api-helper';

export const setRole = (username: string, role: Role) => {
  const postBody = JSON.stringify({
    role: role,
  });
  return doPost(`/api/users/${username}/setRole`, postBody).catch((err) => {
    throw Error(err.message);
  });
};

export const fetchUsersByRole = (role: Role) => {
  return doFetch(`/api/users?role=${role}`)
    .then((res) => res.json())
    .catch((err) => {
      throw Error(err.message);
    });
};

export const fetchBlockedUsersAndIPs = () => {
  return doFetch(`/api/lockedUsers`)
    .then((res) => res.json())
    .catch((err) => {
      throw Error(err.message);
    });
};

export const unlockUserAndIP = (name: string, ip: string) => {
  const postBody = JSON.stringify({
    name: name,
    ip: ip,
  });
  return doPost(`/api/admin/unlock`, postBody).catch((err) => {
    throw Error(err.message);
  });
};

export const lockUserAndIP = (name: string, ip: string, reason: string) => {
  const postBody = JSON.stringify({
    name: name,
    ip: ip,
    reason: reason,
  });
  return doPost(`/api/admin/lock`, postBody).catch((err) => {
    throw Error(err.message);
  });
};
