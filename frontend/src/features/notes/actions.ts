import { actions } from './reducer';
import { Note } from './interface';
import {History} from "history";

export const updateNotes = (projectId: number) =>
  actions.NotesUpdate({ projectId: projectId });
export const updateNoteContents = (noteId: number) =>
    actions.NoteContentsUpdate({ noteId: noteId });
export const updateNoteContentRevision = (noteId: number, contentId: number, revisionId: number) =>
    actions.NoteContentRevisionUpdate({noteId: noteId, contentId: contentId, revisionId: revisionId});
export const createNote = (projectId: number, name: string) =>
  actions.NotesCreate({ projectId: projectId, name: name });
export const createContent = (noteId: number, text: string) =>
  actions.NoteContentCreate({ noteId: noteId, text: text});
export const getNote = (noteId: number) =>
    actions.NoteGet({ noteId: noteId });
export const putNote = (projectId: number, notes: Note[]) =>
  actions.NotePut({ projectId: projectId, notes: notes });
export const deleteNote = (noteId: number) =>
  actions.NoteDelete({ noteId: noteId });
export const deleteContent = (noteId: number, contentId: number) =>
    actions.NoteContentDelete({ noteId: noteId, contentId: contentId });
export const patchNote = (noteId: number, name: string) =>
  actions.NotePatch({ noteId: noteId, name: name });
export const patchContent = (noteId: number, contentId: number, text: string) =>
    actions.NoteContentPatch({ noteId: noteId, contentId: contentId, text: text });
export const setNoteLabels = (noteId: number, labels: number[]) =>
  actions.NoteSetLabels({ noteId: noteId, labels: labels });
export const moveNote = (noteId: number, targetProject: number, history: History) =>
  actions.NoteMove({ noteId: noteId, targetProject: targetProject, history: history });
export const updateNoteVisible = (visible: boolean) =>
  actions.UpdateAddNoteVisible({ visible: visible });
export const shareNote = (noteId: number, generateLink: boolean, targetUser?: string, targetGroup?: number, ttl?: number) =>
    actions.NoteShare({noteId: noteId, generateLink: generateLink, targetUser: targetUser, targetGroup: targetGroup, ttl: ttl});
export const getNoteSharables = (noteId: number) =>
    actions.NoteSharablesGet({noteId: noteId});
export const revokeNoteSharable = (noteId: number, user?: string, link?: string) =>
    actions.NoteRevokeSharable({noteId: noteId, user: user, link: link});
