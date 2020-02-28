import { doFetch, doPost, doDelete, doPut, doPatch } from './api-helper';
import { Note } from '../features/notes/interface';

export const fetchNotes = (projectId: number) => {
  return doFetch(`http://localhost:8081/api/projects/${projectId}/notes`)
    .then(res => res)
    .catch(err => {
      throw Error(err.message);
    });
};

export const getNoteById = (noteId: number) => {
  return doFetch(`http://localhost:8081/api/notes/${noteId}`)
    .then(res => res.json())
    .catch(err => {
      throw Error(err.message);
    });
};

export const deleteNoteById = (noteId: number) => {
  return doDelete(`http://localhost:8081/api/notes/${noteId}`)
    .catch(err => {
      throw Error(err.message);
    });
};

export const createNotes = (projectId: number, name: string) => {
  const postBody = JSON.stringify({
    name: name,
  });
  return doPost(`http://localhost:8081/api/projects/${projectId}/notes`, postBody)
    .then(res => res.json())
    .catch(err => {
      throw Error(err.message);
    });
};

export const putNotes = (projectId: number, notes: Note[]) => {
  const putBody = JSON.stringify({
    notes: notes,
  });
  return doPut(`http://localhost:8081/api/projects/${projectId}/notes`, putBody)
    .catch(err => {
      throw Error(err.message);
    });
}

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