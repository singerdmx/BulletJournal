import { doFetch } from './api-helper';

export const fetchSystemUpdates = () => {
  return doFetch('/api/system/updates')
    .then(res => res.json())
    .catch(err => {
      throw Error(err.message);
    });
};
