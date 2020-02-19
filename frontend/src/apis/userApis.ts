import { doFetch, doPost } from './api-helper';

export const fetchUser = (username: string) => {
  return doFetch(`/api/users/${username}`)
    .then(res => res.json())
    .catch(err => {
      throw Error(err);
    });
};
