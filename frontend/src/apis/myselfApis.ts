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
  return doPost('/api/myself/logout');
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

  return doPatch('/api/myself', patchBody)
    .then(res => res.json())
    .catch(err => {
      throw Error(err.message);
    });
};

export const clearMyself = () => {
  return doPost('/api/myself/clear')
      .catch(err => {
        throw Error(err.message);
      });
};

export const getUserPointActivities = () => {
    return doFetch(('/api/pointActivities'))
      .then(res => res.json())
      .catch(err => {
            throw Error(err.message);
      });
}

