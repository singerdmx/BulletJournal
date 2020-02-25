import { doFetch, doPost, doPatch } from './api-helper';

export const fetchMyself = (expand = false) => {
  let endpoint = '/api/myself';
  if (expand) endpoint += '?expand=true';

  return doFetch(endpoint)
    .then(res => res.json())
    .catch(err => {
      throw Error(err.message);
    });
};

export const logoutUser = () => {
  const postBody = JSON.stringify({});
  return doPost('/api/myself/logout', postBody);
};

export const patchMyself = (timezone?: string, before?: number) => {
  const patchBody = JSON.stringify({
    timezone: timezone,
    reminderBeforeTask: before
  });

  return doPatch('/api/myself', patchBody)
    .then(res => res.json())
    .catch(err => {
      throw Error(err.message);
    });
};
