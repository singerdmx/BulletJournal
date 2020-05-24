import { doFetch } from './api-helper';

export const fetchProjectItems = (
  projectTypes: string[],
  timezone: string,
  startDate: string,
  endDate: string
) => {
  if (projectTypes.length === 0) {
    return Promise.resolve([]);
  }

  // e.g. "/api/projectItems?types=TODO&types=LEDGER&timezone=America%2FLos_Angeles"
  return doFetch(
    '/api/projectItems?' +
      projectTypes.map(p => `types=${p}`).join('&') +
      '&timezone=' +
      encodeURIComponent(timezone) +
      '&startDate=' +
      startDate +
      '&endDate=' +
      endDate
  )
    .then(res => res.json())
    .catch(err => {
      throw Error(err.message);
    });
};

export const fetchRecentProjectItems = (
    projectTypes: string[],
    timezone: string,
    startDate: string,
    endDate: string
) => {
  if (projectTypes.length === 0) {
    return Promise.resolve([]);
  }

  // e.g. "/api/recentItems?types=TODO&types=LEDGER&timezone=America%2FLos_Angeles"
  return doFetch(
      '/api/recentItems?' +
      projectTypes.map(p => `types=${p}`).join('&') +
      '&timezone=' +
      encodeURIComponent(timezone) +
      '&startDate=' +
      startDate +
      '&endDate=' +
      endDate
  )
      .then(res => res.json())
      .catch(err => {
        throw Error(err.message);
      });
};
