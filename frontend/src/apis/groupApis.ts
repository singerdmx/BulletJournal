import { doFetch, doPost, doDelete, doPatch } from './api-helper';

export const fetchGroups = () => {
  return doFetch('/api/groups')
    .then(res => res)
    .catch(err => {
      throw Error(err.message);
    });
};

export const getGroup = (groupId: number) => {
  return doFetch(`/api/groups/${groupId}`)
    .then(res => res.json())
    .catch(err => {
      throw Error(err.message);
    });
};

export const addGroup = (name: string) => {
  const postBody = JSON.stringify({
    name: name
  });
  return doPost('/api/groups', postBody)
    .then(res => res.json())
    .catch(err => {
      throw Error(err.message);
    });
};

export const addUserGroup = (groupId: number, username: string) => {
  const postBody = JSON.stringify({
    groupId: groupId,
    username: username
  });
  return doPost('/api/addUserGroup', postBody)
    .then(res => res.json())
    .catch(err => {
      throw Error(err.message);
    });
};

export const removeUserGroup = (groupId: number, username: string) => {
  const postBody = JSON.stringify({
    groupId: groupId,
    username: username
  });
  return doPost('/api/removeUserGroup', postBody).catch(err => {
    throw Error(err.message);
  });
};

export const deleteGroup = (groupId: number) => {
  return doDelete(`/api/groups/${groupId}`, true);
};

export const updateGroup = (groupId: number, name: string) => {
  const patchBody = JSON.stringify({
    name: name
  });

  return doPatch(`/api/groups/${groupId}`, patchBody)
    .then(res => res.json())
    .catch(err => {
      throw Error(err.message);
    });
};
