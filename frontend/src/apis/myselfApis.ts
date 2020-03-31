import { doFetch, doPost, doPatch } from './api-helper';

export const fetchMyself = (expand = false) => {
  let endpoint = 'http://localhost:8081/api/myself';
  if (expand) endpoint += '?expand=true';

  return doFetch(endpoint)
    .then(res => res.json())
    .catch(err => {
      throw Error(err.message);
    });
};

export const logoutUser = () => {
  const postBody = JSON.stringify({});
  return doPost('http://localhost:8081/api/myself/logout', postBody);
};

export const patchMyself = (
  timezone?: string,
  before?: number,
  currency?: string,
  theme?: string
) => {
  const patchBody = JSON.stringify({
    timezone: timezone,
    reminderBeforeTask: before,
    currency: currency,
    theme: theme
  });

  return doPatch('http://localhost:8081/api/myself', patchBody)
    .then(res => res.json())
    .catch(err => {
      throw Error(err.message);
    });
};
