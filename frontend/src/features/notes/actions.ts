import { actions } from './reducer';
import { Note } from './interface';
export const updateNotes = (projectId: number) => actions.NotesUpdate({projectId: projectId});
export const createNote = (projectId: number, name: string) => actions.NotesCreate({projectId: projectId, name: name});
export const putNote = (projectId: number, notes: Note[]) => actions.NotePut({ projectId: projectId, notes: notes });
export const deleteNote = (noteId: number) => actions.NoteDelete({ noteId: noteId });
export const patchNote = (noteId: number, name: string) => actions.PatchNote({noteId: noteId, name: name});