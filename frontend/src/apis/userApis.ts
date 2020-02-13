import { doFetch } from './api-helper';

export const fetchUserInfo = () => {
  return doFetch('/api/myself', 'GET')
    .then(res => res.json())
    .catch(err => {
      throw Error(err);
    });
};

export const logoutUser = () => {
  return doFetch('/api/myself/logout', 'POST');
};
