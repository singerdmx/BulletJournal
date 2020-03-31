import { doFetch, doPost, doDelete, doPatch } from './api-helper';

export const fetchGroups = () => {
  return doFetch('http://localhost:8081/api/groups')
    .then(res => res)
    .catch(err => {
      throw Error(err.message);
    });
};

export const getGroup = (groupId: number) => {
  return doFetch(`http://localhost:8081/api/groups/${groupId}`)
    .then(res => res.json())
    .catch(err => {
      throw Error(err.message);
    });
};

export const addGroup = (name: string) => {
  const postBody = JSON.stringify({
    name: name
  });
  return doPost('http://localhost:8081/api/groups', postBody)
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
  return doPost('http://localhost:8081/api/addUserGroup', postBody)
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
  return doPost('http://localhost:8081/api/removeUserGroup', postBody).catch(err => {
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

  return doPatch(`http://localhost:8081/api/groups/${groupId}`, patchBody)
    .then(res => res.json())
    .catch(err => {
      throw Error(err.message);
    });
};
