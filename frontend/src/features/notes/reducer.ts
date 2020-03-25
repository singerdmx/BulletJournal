import { createSlice, PayloadAction } from 'redux-starter-kit';
import { Note } from './interface';

export type NoteApiErrorAction = {
  error: string;
};

export type UpdateNotes = {
  projectId: number;
};

export type updateVisibleAction = {
  visible: boolean;
};

export type CreateNote = {
  projectId: number;
  name: string;
};

export type GetNote = {
  noteId: number;
};

export type NotesAction = {
  notes: Array<Note>;
};

export type NoteAction = {
  note: Note;
};

export type PutNote = {
  projectId: number;
  notes: Note[];
};

export type DeleteNote = {
  noteId: number;
};

export type PatchNote = {
  noteId: number;
  name: string;
};

export type SetNoteLabels = {
  noteId: number;
  labels: number[];
};

export type MoveNote = {
  noteId: number;
  targetProject: number;
};

let initialState = {
  note: {} as Note,
  notes: [] as Array<Note>,
  addNoteVisible: false
};

const slice = createSlice({
  name: 'note',
  initialState,
  reducers: {
    notesReceived: (state, action: PayloadAction<NotesAction>) => {
      const { notes } = action.payload;
      state.notes = notes;
    },
    noteReceived: (state, action: PayloadAction<NoteAction>) => {
      const { note } = action.payload;
      state.note = note;
    },
    updateAddNoteVisible: (
      state,
      action: PayloadAction<updateVisibleAction>
    ) => {
      const { visible } = action.payload;
      state.addNoteVisible = visible;
    },
    noteApiErrorReceived: (state, action: PayloadAction<NoteApiErrorAction>) =>
      state,
    NotesUpdate: (state, action: PayloadAction<UpdateNotes>) => state,
    NotesCreate: (state, action: PayloadAction<CreateNote>) => state,
    NotePut: (state, action: PayloadAction<PutNote>) => state,
    NoteGet: (state, action: PayloadAction<GetNote>) => state,
    NoteDelete: (state, action: PayloadAction<DeleteNote>) => state,
    NotePatch: (state, action: PayloadAction<PatchNote>) => state,
    NoteSetLabels: (state, action: PayloadAction<SetNoteLabels>) => state,
    NoteMove: (state, action: PayloadAction<MoveNote>) => state
  }
});

export const reducer = slice.reducer;
export const actions = slice.actions;
