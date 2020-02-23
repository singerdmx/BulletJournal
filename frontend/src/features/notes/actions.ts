import { actions } from './reducer';
export const updateNotes = (projectId: number) => actions.NotesUpdate({projectId: projectId});
export const createNote = (projectId: number, name: string) => actions.NotesCreate({projectId: projectId, name: name});