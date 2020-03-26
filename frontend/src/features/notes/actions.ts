import { actions } from './reducer';
import { Note } from './interface';
import {History} from "history";

export const updateNotes = (projectId: number) =>
  actions.NotesUpdate({ projectId: projectId });
export const createNote = (projectId: number, name: string) =>
  actions.NotesCreate({ projectId: projectId, name: name });
export const getNote = (noteId: number) =>
    actions.NoteGet({ noteId: noteId });
export const putNote = (projectId: number, notes: Note[]) =>
  actions.NotePut({ projectId: projectId, notes: notes });
export const deleteNote = (noteId: number) =>
  actions.NoteDelete({ noteId: noteId });
export const patchNote = (noteId: number, name: string) =>
  actions.NotePatch({ noteId: noteId, name: name });
export const setNoteLabels = (noteId: number, labels: number[]) =>
  actions.NoteSetLabels({ noteId: noteId, labels: labels });
export const moveNote = (noteId: number, targetProject: number, history: History) =>
  actions.NoteMove({ noteId: noteId, targetProject: targetProject, history: history });
export const updateNoteVisible = (visible: boolean) =>
  actions.updateAddNoteVisible({ visible: visible });
