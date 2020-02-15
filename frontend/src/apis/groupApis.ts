import { doFetch } from './api-helper';

export const fetchGroups = () => {
  return doFetch('/api/groups', 'GET')
    .then(res => res.json())
    .catch(err => {
      throw Error(err);
    });
};
