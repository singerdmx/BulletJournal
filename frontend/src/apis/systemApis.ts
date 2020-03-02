import { doFetch } from './api-helper';

export const fetchSystemUpdates = (targets = '') => {
  let endpoint = '/api/system/updates';
  if (targets) endpoint += '?targets=' + targets;
  return doFetch(endpoint)
    .then(res => res.json())
    .catch(err => {
      throw Error(err.message);
    });
};
