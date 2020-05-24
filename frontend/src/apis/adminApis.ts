import { Role } from '../features/admin/interface';
import { doPost } from './api-helper';

export const setRole = (username: string, role: Role) => {
  console.log('inside saga');
  console.log(role);
  const postBody = JSON.stringify({
    role: role,
  });
  return doPost(`/api/users/${username}/setRole`, postBody).catch((err) => {
    throw Error(err.message);
  });
};
