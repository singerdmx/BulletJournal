import { doFetch, doPost } from './api-helper';

export const fetchMyself = (expand = false) => {
  let endpoint = '/api/myself';
  if (expand) endpoint += '?expand=true';

  return doFetch(endpoint)
    .then(res => res.json())
    .catch(err => {
      throw Error(err);
    });
};

export const logoutUser = () => {
  const postBody = JSON.stringify({});
  return doPost('/api/myself/logout', postBody);
};
