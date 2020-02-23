import { doFetch, doPost, doDelete, doPatch } from './api-helper';

export const fetchNotes = (projectId: number) => {
  return doFetch(`/api/projects/${projectId}/notes`)
    .then(res => res)
    .catch(err => {
      throw Error(err);
    });
};

export const getNote = (noteId: number) => {
  return doFetch(`/api/notes/${noteId}`)
    .then(res => res.json())
    .catch(err => {
      throw Error(err);
    });
};

export const createNotes = (projectId: number, name: string) => {
  const postBody = JSON.stringify({
    name: name,
    projectId: projectId
  });
  return doPost(`/api/projects/${projectId}/notes`, postBody)
    .then(res => res.json())
    .catch(err => {
      throw Error(err);
    });
};