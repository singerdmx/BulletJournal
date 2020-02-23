import { createSlice, PayloadAction } from 'redux-starter-kit';
import { Note } from './interface';

export type NoteApiErrorAction = {
  error: string;
};

export type UpdateNotes = {
    projectId: number
};

export type CreateNote = {
    projectId: number;
    name: string;
}

export type NotesAction = {
  notes: Array<Note>;
};

let initialState = {
  notes: [] as Array<Note>
};

const slice = createSlice({
  name: 'notice',
  initialState,
  reducers: {
    notesReceived: (
      state,
      action: PayloadAction<NotesAction>
    ) => {
      const { notes } = action.payload;
      state.notes = notes;
    },
    noteApiErrorReceived: (
      state,
      action: PayloadAction<NoteApiErrorAction>
    ) => state,
    NotesUpdate: (state, action: PayloadAction<UpdateNotes>) =>state,
    NotesCreate: (state, action: PayloadAction<CreateNote>) => state
    }
});

export const reducer = slice.reducer;
export const actions = slice.actions;