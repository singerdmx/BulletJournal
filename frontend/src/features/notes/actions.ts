import {actions} from './reducer';
import {Note} from './interface';
import {History} from 'history';
import {ProjectItemUIType} from "../project/constants";

export const updateNotes = (projectId: number) =>
  actions.NotesUpdate({ projectId: projectId });
export const updateNoteContents = (noteId: number, updateDisplayMore?: boolean) =>
  actions.NoteContentsUpdate({ noteId: noteId, updateDisplayMore: updateDisplayMore });
export const updateNoteContentRevision = (
  noteId: number,
  contentId: number,
  revisionId: number
) =>
  actions.NoteContentRevisionUpdate({
    noteId: noteId,
    contentId: contentId,
    revisionId: revisionId,
  });
export const createNote = (projectId: number, name: string, labels: number[]) =>
  actions.NotesCreate({ projectId: projectId, name: name, labels: labels });
export const createContent = (noteId: number, text: string) =>
  actions.NoteContentCreate({ noteId: noteId, text: text });
export const getNote = (noteId: number) => actions.NoteGet({ noteId: noteId });
export const putNote = (projectId: number, notes: Note[]) =>
  actions.NotePut({ projectId: projectId, notes: notes });
export const deleteNote = (noteId: number, type: ProjectItemUIType) =>
  actions.NoteDelete({ noteId: noteId, type: type });
export const deleteNotes = (
  projectId: number,
  notesId: number[],
  type: ProjectItemUIType
) =>
  actions.NotesDelete({
    projectId: projectId,
    notesId: notesId,
    type: type,
  });
export const deleteContent = (noteId: number, contentId: number) =>
  actions.NoteContentDelete({ noteId: noteId, contentId: contentId });
export const patchNote = (noteId: number, name: string, labels?: number[]) =>
  actions.NotePatch({ noteId: noteId, name: name, labels: labels });
export const patchContent = (noteId: number, contentId: number, text: string, diff: string) =>
  actions.NoteContentPatch({
    noteId: noteId,
    contentId: contentId,
    text: text,
    diff: diff,
  });
export const setNoteLabels = (noteId: number, labels: number[]) =>
  actions.NoteSetLabels({ noteId: noteId, labels: labels });
export const moveNote = (
  noteId: number,
  targetProject: number,
  history: History
) =>
  actions.NoteMove({
    noteId: noteId,
    targetProject: targetProject,
    history: history,
  });
export const updateNoteVisible = (visible: boolean) =>
  actions.UpdateAddNoteVisible({ visible: visible });
export const shareNote = (
  noteId: number,
  generateLink: boolean,
  targetUser?: string,
  targetGroup?: number,
  ttl?: number
) =>
  actions.NoteShare({
    noteId: noteId,
    generateLink: generateLink,
    targetUser: targetUser,
    targetGroup: targetGroup,
    ttl: ttl,
  });
export const getNoteSharables = (noteId: number) =>
  actions.NoteSharablesGet({ noteId: noteId });
export const revokeNoteSharable = (
  noteId: number,
  user?: string,
  link?: string
) => actions.NoteRevokeSharable({ noteId: noteId, user: user, link: link });

export const removeSharedNote = (noteId: number) =>
    actions.NoteRemoveShared({noteId: noteId});

export const getNotesByOwner = (projectId: number, owner: string) =>
  actions.getNotesByOwner({
    projectId: projectId,
    owner: owner,
  });

export const getNotesByOrder = (
  projectId: number,
  timezone: string,
  startDate?: string,
  endDate?: string
) =>
  actions.getNotesByOrder({
    projectId: projectId,
    timezone: timezone,
    startDate: startDate,
    endDate: endDate,
  });

export const patchNoteRevisionContents = (
    noteId: number,
    contentId: number,
    revisionContents: string[],
    etag: string
) => actions.NotePatchRevisionContents({
    noteId: noteId, contentId: contentId, revisionContents: revisionContents, etag: etag});

export const noteReceived = (note: Note | undefined) => actions.noteReceived({note: note});