import { doFetch } from './api-helper';

export const fetchProjects = () => {
  return doFetch('/api/projects')
    .then(res => res.json())
    .catch(err => {
      throw Error(err);
    });
};
