import { createSlice, PayloadAction } from 'redux-starter-kit';
import { Note } from './interface';
import { History } from 'history';
import { Content } from '../myBuJo/interface';
import { ProjectItemSharables, SharableLink } from '../system/interface';
import { User } from '../group/interface';
import {ProjectItemUIType} from "../project/constants";

export type NoteApiErrorAction = {
  error: string;
};

export type UpdateNotes = {
  projectId: number;
};

export type UpdateNoteContents = {
  noteId: number;
  updateDisplayMore?: boolean;
};

export type UpdateNoteContentRevision = {
  noteId: number;
  contentId: number;
  revisionId: number;
};

export type updateVisibleAction = {
  visible: boolean;
};

export type CreateNote = {
  projectId: number;
  name: string;
  labels?: number[];
};

export type CreateContent = {
  noteId: number;
  text: string;
};

export type GetNote = {
  noteId: number;
};

export type NotesAction = {
  notes: Array<Note>;
};

export type NoteAction = {
  note?: Note;
};

export type PutNote = {
  projectId: number;
  notes: Note[];
};

export type DeleteNote = {
  noteId: number;
  type: ProjectItemUIType;
};

export type DeleteContent = {
  noteId: number;
  contentId: number;
};

export type PatchNote = {
  noteId: number;
  name: string;
  labels?: number[];
};

export type PatchContent = {
  noteId: number;
  contentId: number;
  text: string;
  diff: string;
};

export type SetNoteLabels = {
  noteId: number;
  labels: number[];
};

export type MoveNote = {
  noteId: number;
  targetProject: number;
  history: History;
};

export type ShareNote = {
  targetUser?: string;
  noteId: number;
  targetGroup?: number;
  generateLink: boolean;
  ttl?: number;
};

export type GetSharables = {
  noteId: number;
};

export type RevokeSharable = {
  noteId: number;
  user?: string;
  link?: string;
};

export type RemoveShared = {
  noteId: number;
};

export type ContentsAction = {
  contents: Content[];
};

export type DeleteNotes = {
  projectId: number;
  notesId: number[];
  type: ProjectItemUIType;
};

export type ShareLinkAction = {
  link: string;
};

export type GetNotesByOwner = {
  projectId: number;
  owner: string;
};

export type NotesByOwnerAction = {
  notesByOwner: Array<Note>;
};

export type GetNotesByOrder = {
  projectId: number;
  timezone: string;
  startDate?: string;
  endDate?: string;
};

export type NotesByOrderAction = {
  notesByOrder: Array<Note>;
};

export type PatchRevisionContents = {
  noteId: number;
  contentId: number;
  revisionContents: string[];
  etag: string;
}

let initialState = {
  note: undefined as Note | undefined,
  contents: [] as Array<Content>,
  notes: [] as Array<Note>,
  addNoteVisible: false,
  patchLoading: true,
  sharedUsers: [] as User[],
  sharedLinks: [] as SharableLink[],
  sharedLink: '',
  notesByOwner: [] as Array<Note>,
  notesByOrder: [] as Array<Note>,
};

const slice = createSlice({
  name: 'note',
  initialState,
  reducers: {
    notesByOrderReceived: (
      state,
      action: PayloadAction<NotesByOrderAction>
    ) => {
      const { notesByOrder } = action.payload;
      state.notesByOrder = notesByOrder;
    },
    getNotesByOrder: (state, action: PayloadAction<GetNotesByOrder>) => state,
    notesByOwnerReceived: (
      state,
      action: PayloadAction<NotesByOwnerAction>
    ) => {
      const { notesByOwner } = action.payload;
      state.notesByOwner = notesByOwner;
    },
    getNotesByOwner: (state, action: PayloadAction<GetNotesByOwner>) => state,
    notesReceived: (state, action: PayloadAction<NotesAction>) => {
      const { notes } = action.payload;
      state.notes = notes;
      state.patchLoading = false;
    },
    noteReceived: (state, action: PayloadAction<NoteAction>) => {
      const { note } = action.payload;
      state.note = note;
    },
    noteContentsReceived: (state, action: PayloadAction<ContentsAction>) => {
      const { contents } = action.payload;
      state.contents = contents;
    },
    noteSharablesReceived: (
      state,
      action: PayloadAction<ProjectItemSharables>
    ) => {
      const { users, links } = action.payload;
      state.sharedUsers = users;
      state.sharedLinks = links;
    },
    sharedLinkReceived: (state, action: PayloadAction<ShareLinkAction>) => {
      const { link } = action.payload;
      state.sharedLink = link;
    },
    UpdateAddNoteVisible: (
      state,
      action: PayloadAction<updateVisibleAction>
    ) => {
      const { visible } = action.payload;
      state.addNoteVisible = visible;
    },
    noteApiErrorReceived: (state, action: PayloadAction<NoteApiErrorAction>) =>
      state,
    NotesUpdate: (state, action: PayloadAction<UpdateNotes>) => state,
    NoteContentsUpdate: (state, action: PayloadAction<UpdateNoteContents>) =>
      state,
    NoteContentRevisionUpdate: (
      state,
      action: PayloadAction<UpdateNoteContentRevision>
    ) => state,
    NotesCreate: (state, action: PayloadAction<CreateNote>) => state,
    NoteContentCreate: (state, action: PayloadAction<CreateContent>) => state,
    NotePut: (state, action: PayloadAction<PutNote>) => state,
    NoteGet: (state, action: PayloadAction<GetNote>) => state,
    NoteDelete: (state, action: PayloadAction<DeleteNote>) => state,
    NotesDelete: (state, action: PayloadAction<DeleteNotes>) => state,
    NoteContentDelete: (state, action: PayloadAction<DeleteContent>) => state,
    NotePatch: (state, action: PayloadAction<PatchNote>) => {
      state.patchLoading = false;
    },
    NoteContentPatch: (state, action: PayloadAction<PatchContent>) => state,
    NoteSetLabels: (state, action: PayloadAction<SetNoteLabels>) => state,
    NoteMove: (state, action: PayloadAction<MoveNote>) => state,
    NoteShare: (state, action: PayloadAction<ShareNote>) => state,
    NoteSharablesGet: (state, action: PayloadAction<GetSharables>) => state,
    NoteRevokeSharable: (state, action: PayloadAction<RevokeSharable>) => state,
    NoteRemoveShared: (state, action: PayloadAction<RemoveShared>) => state,
    NotePatchRevisionContents: (state, action: PayloadAction<PatchRevisionContents>) => state,
  },
});

export const reducer = slice.reducer;
export const actions = slice.actions;
