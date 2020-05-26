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
