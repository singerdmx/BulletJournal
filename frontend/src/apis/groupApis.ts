import { doFetch, doPost } from './api-helper';

export const fetchGroups = () => {
  return doFetch('/api/groups')
    .then(res => res.json())
    .catch(err => {
      throw Error(err);
    });
};

export const createGroups = (name: string) => {
  const postBody = JSON.stringify({
    name: name
  })
  return doPost('/api/groups', postBody)
    .then(res => res.json())
    .catch(err => {
      throw Error(err);
    });
};
