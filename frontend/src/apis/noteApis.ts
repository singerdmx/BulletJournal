import { doFetch, doPost, doDelete, doPatch } from './api-helper';
import { Note } from '../features/notes/interface';

export const fetchNotes = (projectId: number) => {
  return doFetch(`http://localhost:8081/api/projects/${projectId}/notes`)
    .then(res => res)
    .catch(err => {
      throw Error(err);
    });
};

export const getNoteById = (noteId: number) => {
  return doFetch(`http://localhost:8081/api/notes/${noteId}`)
    .then(res => res.json())
    .catch(err => {
      throw Error(err);
    });
};

export const deleteNoteById = (noteId: number) => {
  return doFetch(`http://localhost:8081/api/notes/${noteId}`)
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
  return doPost(`http://localhost:8081/api/projects/${projectId}/notes`, postBody)
    .then(res => res.json())
    .catch(err => {
      throw Error(err);
    });
};

export const putNotes = (projectId: number, notes: Note[]) => {
  const postBody = JSON.stringify({
    notes: notes,
  });
  return doPost(`http://localhost:8081/api/projects/${projectId}/notes`, postBody)
    .then(res => res.json())
    .catch(err => {
      throw Error(err);
    });
}