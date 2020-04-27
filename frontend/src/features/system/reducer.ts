import { createSlice, PayloadAction } from 'redux-starter-kit';
import {Note} from "../notes/interface";
import {Content} from "../myBuJo/interface";
import {Task} from "../tasks/interface";
import {ContentType} from "../myBuJo/constants";

export type SystemApiErrorAction = {
  error: string;
};

export type UpdateSystem = {};

export type SystemUpdate = {
  tasksEtag: string;
  notesEtag: string;
  groupsEtag: string;
  notificationsEtag: string;
  ownedProjectsEtag: string;
  sharedProjectsEtag: string;
  remindingTaskEtag: string;
  reminders: Task[];
};

export type PublicProjectItemUpdate = {
  publicNote?: Note;
  publicTask?: Task;
  contents: Content[];
  contentType: ContentType;
};

export type GetPublicProjectItem = {
  itemId: string;
};

let initialState = {
  tasksEtag: '',
  notesEtag: '',
  groupsEtag: '',
  notificationsEtag: '',
  ownedProjectsEtag: '',
  sharedProjectsEtag: '',
  remindingTaskEtag: '',
  publicNote: {} as Note,
  publicTask: {} as Task,
  reminders: [] as Task[],
  contents: [] as Array<Content>,
  contentType: ContentType.NOTE
};

const slice = createSlice({
  name: 'system',
  initialState,
  reducers: {
    systemUpdateReceived: (state, action: PayloadAction<SystemUpdate>) => {
      const {
        groupsEtag,
        tasksEtag,
        notesEtag,
        notificationsEtag,
        ownedProjectsEtag,
        sharedProjectsEtag,
        remindingTaskEtag,
        reminders
      } = action.payload;
      if (tasksEtag) {
        state.tasksEtag = tasksEtag;
      }
      if (notesEtag) {
        state.notesEtag = notesEtag;
      }
      if (groupsEtag) {
        state.groupsEtag = groupsEtag;
      }
      if (notificationsEtag) {
        state.notificationsEtag = notificationsEtag;
      }
      if (ownedProjectsEtag) {
        state.ownedProjectsEtag = ownedProjectsEtag;
      }
      if (sharedProjectsEtag) {
        state.sharedProjectsEtag = sharedProjectsEtag;
      }
      if (remindingTaskEtag) {
        state.remindingTaskEtag = remindingTaskEtag;
      }
      if (reminders && reminders.length > 0) {
        state.reminders = reminders
      }
    },
    systemApiErrorReceived: (
      state,
      action: PayloadAction<SystemApiErrorAction>
    ) => state,
    systemUpdate: (state, action: PayloadAction<UpdateSystem>) => state,
    fetchPublicProjectItem: (state, action: PayloadAction<GetPublicProjectItem>) => state,
    publicProjectItemReceived: (state, action: PayloadAction<PublicProjectItemUpdate>) => {
      const {contents, contentType, publicNote, publicTask} = action.payload;
      state.contentType = contentType;
      state.contents = contents;
      if (publicNote) {
        state.publicNote = publicNote;
      }
      if (publicTask) {
        state.publicTask = publicTask;
      }
    }
  }
});

export const reducer = slice.reducer;
export const actions = slice.actions;
