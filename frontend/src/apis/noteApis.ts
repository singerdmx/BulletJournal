import {doDelete, doFetch, doPatch, doPost, doPut} from './api-helper';
import {Note} from '../features/notes/interface';

export const fetchNotes = (
  projectId: number,
  owner?: string,
  timezone?: string,
  startDate?: string,
  endDate?: string,
  order?: boolean
) => {
  let url = `/api/projects/${projectId}/notes`;
  if (owner) url += `?owner=${owner}`;
  if (order) {
    url += `?order=true&timezone=${timezone}`;
    if (startDate) url += `&startDate=${startDate}`;
    if (endDate) url += `&endDate=${endDate}`;
  }
  return doFetch(url)
    .then((res) => res)
    .catch((err) => {
      throw Error(err.message);
    });
};

export const getNoteById = (noteId: number) => {
  return doFetch(`/api/notes/${noteId}`)
    .then((res) => res.json())
    .catch((err) => {
      throw Error(err.message);
    });
};

export const deleteNoteById = (noteId: number) => {
  return doDelete(`/api/notes/${noteId}`)
    .then((res) => res)
    .catch((err) => {
      throw Error(err.message);
    });
};

export const deleteNotes = (projectId: number, notesId: number[]) => {
  let url = `/api/projects/${projectId}/notes`;
  if (notesId && notesId.length > 0) {
    url += `?notes=${notesId[0]}`;

    for (var i = 1; i < notesId.length; i++) {
      url += `&notes=${notesId[i]}`;
    }
  }
  return doDelete(url).catch((err) => {
    throw Error(err.message);
  });
};

export const createNote = (
  projectId: number,
  name: string,
  labels?: number[]
) => {
  const postBody = JSON.stringify({
    name: name,
    labels: labels,
  });
  return doPost(`/api/projects/${projectId}/notes`, postBody)
    .then((res) => res.json())
    .catch((err) => {
      throw Error(err.message);
    });
};

export const putNotes = (projectId: number, notes: Note[], etag: string) => {
  const putBody = JSON.stringify(notes);
  return doPut(`/api/projects/${projectId}/notes`, putBody, etag).catch(
    (err) => {
      throw Error(err.message);
    }
  );
};

export const updateNote = (noteId: number, name: string, labels?: number[]) => {
  const patchBody = JSON.stringify({
    name: name,
    labels: labels,
  });
  return doPatch(`/api/notes/${noteId}`, patchBody)
    .then((res) => res.json())
    .catch((err) => {
      throw Error(err);
    });
};

export const setNoteLabels = (noteId: number, labels: number[]) => {
  const putBody = JSON.stringify(labels);
  return doPut(`/api/notes/${noteId}/setLabels`, putBody)
    .then((res) => res.json())
    .catch((err) => {
      throw Error(err.message);
    });
};

export const moveToTargetProject = (noteId: number, targetProject: number) => {
  const postBody = JSON.stringify({
    targetProject: targetProject,
  });
  return doPost(`/api/notes/${noteId}/move`, postBody)
    .then((res) => res)
    .catch((err) => {
      throw Error(err);
    });
};

export const shareNoteWithOther = (
  noteId: number,
  generateLink: boolean,
  targetUser?: string,
  targetGroup?: number,
  ttl?: number
) => {
  const postBody = JSON.stringify({
    targetUser: targetUser,
    targetGroup: targetGroup,
    generateLink: generateLink,
    ttl: ttl,
  });
  return doPost(`/api/notes/${noteId}/share`, postBody)
    .then((res) => (generateLink ? res.json() : res))
    .catch((err) => {
      throw Error(err);
    });
};

export const getSharables = (noteId: number) => {
  return doFetch(`/api/notes/${noteId}/sharables`)
    .then((res) => res.json())
    .catch((err) => {
      throw Error(err.message);
    });
};

export const revokeSharable = (
  noteId: number,
  user?: string,
  link?: string
) => {
  const postBody = JSON.stringify({
    user: user,
    link: link,
  });

  return doPost(`/api/notes/${noteId}/revokeSharable`, postBody)
    .then((res) => res)
    .catch((err) => {
      throw Error(err);
    });
};

export const removeShared = (noteId: number) => {
  return doPost(`/api/notes/${noteId}/removeShared`)
      .then((res) => res)
      .catch((err) => {
        throw Error(err);
      });
};

export const getContents = (noteId: number) => {
  return doFetch(`/api/notes/${noteId}/contents`)
    .then((res) => res.json())
    .catch((err) => {
      throw Error(err.message);
    });
};

export const addContent = (noteId: number, text: string) => {
  const postBody = JSON.stringify({
    text: text,
  });

  return doPost(`/api/notes/${noteId}/addContent`, postBody)
    .then((res) => res.json())
    .catch((err) => {
      throw Error(err);
    });
};

export const deleteContent = (noteId: number, contentId: number) => {
  return doDelete(`/api/notes/${noteId}/contents/${contentId}`)
    .then((res) => res)
    .catch((err) => {
      throw Error(err.message);
    });
};

export const updateContent = (
  noteId: number,
  contentId: number,
  text: string,
  etag: string,
  diff: string,
) => {
  const patchBody = JSON.stringify({
    text: text,
    diff: diff,
  });
  return doPatch(`/api/notes/${noteId}/contents/${contentId}`, patchBody, etag)
    .then((res) => res.json())
    .catch((err) => {
      throw Error(err);
    });
};

export const getContentRevision = (
  noteId: number,
  contentId: number,
  revisionId: number
) => {
  return doFetch(
    `/api/notes/${noteId}/contents/${contentId}/revisions/${revisionId}`
  )
    .then((res) => res.json())
    .catch((err) => {
      throw Error(err.message);
    });
};

export const patchRevisionContents = (
    noteId: number,
    contentId: number,
    revisionContents: string[],
    etag: string,
) => {
  const patchBody = JSON.stringify({
    revisionContents: revisionContents,
  });
  return doPost(`/api/notes/${noteId}/contents/${contentId}/patchRevisionContents`, patchBody, etag)
      .then((res) => res.json())
      .catch((err) => {
        throw Error(err);
      });
};
