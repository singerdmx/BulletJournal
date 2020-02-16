import { doFetch, doPost } from './api-helper';

export const fetchUserInfo = () => {
  return doFetch('/api/myself')
    .then(res => res.json())
    .catch(err => {
      throw Error(err);
    });
};

export const logoutUser = () => {
  return doPost('/api/myself/logout');
};
