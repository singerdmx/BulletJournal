import { doFetch } from './api-helper';

export const fetchSystemUpdates = (targets = '', projectId = undefined) => {
  let endpoint = 'http://localhost:8081/api/system/updates';
  if (targets && projectId) endpoint += '?targets=' + targets + '&' + 'projectId=' + projectId;
  if (targets) endpoint += '?targets=' + targets;
  if (projectId) endpoint += '?projectId=' + projectId;
  return doFetch(endpoint)
    .then(res => res.json())
    .catch(err => {
      throw Error(err.message);
    });
};

export const getPublicProjectItem = (itemId: string) => {
    return doFetch(`http://localhost:8081/api/public/items/${itemId}`)
        .then(res => res.json())
        .catch(err => {
            throw Error(err.message);
        });
};
