import { doFetch } from './api-helper';

export const fetchUser = (username: string) => {
  return doFetch(`http://localhost:8081/api/users/${username}`)
    .then(res => res.json())
    .catch(err => {
      throw Error(err);
    });
};
