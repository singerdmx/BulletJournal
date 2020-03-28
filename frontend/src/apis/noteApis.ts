import { doFetch, doPost, doDelete, doPut, doPatch } from './api-helper';
import { Note } from '../features/notes/interface';

export const fetchNotes = (projectId: number) => {
  return doFetch(`/api/projects/${projectId}/notes`)
    .then(res => res)
    .catch(err => {
      throw Error(err.message);
    });
};

export const getNoteById = (noteId: number) => {
  return doFetch(`/api/notes/${noteId}`)
    .then(res => res.json())
    .catch(err => {
      throw Error(err.message);
    });
};

export const deleteNoteById = (noteId: number) => {
    return doDelete(`/api/notes/${noteId}`)
        .then(res => res)
        .catch(err => {
            throw Error(err.message);
        });
};

export const createNote = (projectId: number, name: string) => {
  const postBody = JSON.stringify({
    name: name,
  });
  return doPost(`/api/projects/${projectId}/notes`, postBody)
    .then(res => res.json())
    .catch(err => {
      throw Error(err.message);
    });
};

export const putNotes = (projectId: number, notes: Note[]) => {
  const putBody = JSON.stringify(notes);
  return doPut(`/api/projects/${projectId}/notes`, putBody)
    .catch(err => {
      throw Error(err.message);
    });
};

export const updateNote = (
  noteId: number,
  name: string
) => {
  const patchBody = JSON.stringify({
    name: name
  });
  return doPatch(`/api/notes/${noteId}`, patchBody)
    .then(res => res.json())
    .catch(err => {
      throw Error(err);
    });
};

export const setNoteLabels = (noteId: number, labels: number[]) => {
  const putBody = JSON.stringify(labels);
  return doPut(`/api/notes/{noteId}/setLabels`, putBody)
    .then(res => res.json())
    .catch(err => {
      throw Error(err.message);
    });
};

export const moveToTargetProject = (noteId: number, targetProject: number) => {
    const postBody = JSON.stringify({
        targetProject: targetProject
    });
    return doPost(`/api/notes/${noteId}/move`, postBody)
        .then(res => res)
        .catch(err => {
            throw Error(err);
        });
};

export const shareNoteWithOther = (noteId: number, targetUser: string, targetGroup: number, generateLink: boolean) => {
    const postBody = JSON.stringify({
        targetUser: targetUser,
        targetGroup: targetGroup,
        generateLink: generateLink
    });
    return doPost(`/api/notes/${noteId}/share`, postBody)
        .then(res => res)
        .catch(err => {
            throw Error(err);
        });
};