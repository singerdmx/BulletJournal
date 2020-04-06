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
  return doPut(`/api/notes/${noteId}/setLabels`, putBody)
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

export const shareNoteWithOther = (noteId: number, generateLink: boolean, targetUser?: string, targetGroup?: number, ttl?: number) => {
    const postBody = JSON.stringify({
        targetUser: targetUser,
        targetGroup: targetGroup,
        generateLink: generateLink,
        ttl: ttl
    });
    return doPost(`/api/notes/${noteId}/share`, postBody)
        .then(res => res)
        .catch(err => {
            throw Error(err);
        });
};

export const getSharables = (noteId: number) => {
    return doFetch(`/api/notes/{noteId}/sharables`)
        .then(res => res.json())
        .catch(err => {
            throw Error(err.message);
        });
};

export const revokeSharable = (noteId: number, user?: string, link?: string) => {
    const postBody = JSON.stringify({
        user: user,
        link: link
    });

    return doPost(`/api/notes/{noteId}/revokeSharable`, postBody)
        .then(res => res)
        .catch(err => {
            throw Error(err);
        });
};

export const getContents = (noteId: number) => {
    return doFetch(`/api/notes/${noteId}/contents`)
        .then(res => res.json())
        .catch(err => {
            throw Error(err.message);
        });
};

export const addContent = (noteId: number, text: string) => {
    const postBody = JSON.stringify({
        text: text,
    });

    return doPost(`/api/notes/${noteId}/addContent`, postBody)
        .then(res => res.json())
        .catch(err => {
            throw Error(err);
        });
};

export const deleteContent = (noteId: number, contentId: number) => {
    return doDelete(`/api/notes/${noteId}/contents/${contentId}`)
        .then(res => res)
        .catch(err => {
            throw Error(err.message);
        });
};

export const updateContent = (noteId: number, contentId: number, text: string) => {
    const patchBody = JSON.stringify({
        text: text
    });
    return doPatch(`/api/notes/${noteId}/contents/${contentId}`, patchBody)
        .then(res => res)
        .catch(err => {
            throw Error(err);
        });
};