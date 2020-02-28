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

export type GetNote = {
    noteId: number;
}

export type NotesAction = {
  notes: Array<Note>;
};

export type PutNote = {
  projectId: number,
  notes: Note[]
}

export type DeleteNote = {
  noteId: number
}

let initialState = {
  notes: [] as Array<Note>
};

const slice = createSlice({
  name: 'note',
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
    NotesCreate: (state, action: PayloadAction<CreateNote>) => state,
    NotePut: (state, action: PayloadAction<PutNote>) => state,
    NoteGet: (state, action: PayloadAction<GetNote>) => state,
    NoteDelete: (state, action: PayloadAction<DeleteNote>) => state
    }
});

export const reducer = slice.reducer;
export const actions = slice.actions;