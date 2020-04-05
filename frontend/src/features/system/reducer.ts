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
  groupsEtag: string;
  notificationsEtag: string;
  ownedProjectsEtag: string;
  sharedProjectsEtag: string;
};

export type PublicProjectItemUpdate = {
  note?: Note;
  task?: Task;
  contents: Content[];
  contentType: ContentType;
};

export type GetPublicProjectItem = {
  itemId: string;
};

let initialState = {
  groupsEtag: '',
  notificationsEtag: '',
  ownedProjectsEtag: '',
  sharedProjectsEtag: '',
  note: {} as Note,
  task: {} as Task,
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
        notificationsEtag,
        ownedProjectsEtag,
        sharedProjectsEtag
      } = action.payload;
      state.groupsEtag = groupsEtag;
      state.notificationsEtag = notificationsEtag;
      state.ownedProjectsEtag = ownedProjectsEtag;
      state.sharedProjectsEtag = sharedProjectsEtag;
    },
    systemApiErrorReceived: (
      state,
      action: PayloadAction<SystemApiErrorAction>
    ) => state,
    systemUpdate: (state, action: PayloadAction<UpdateSystem>) => state,
    fetchPublicProjectItem: (state, action: PayloadAction<GetPublicProjectItem>) => state,
    publicProjectItemReceived: (state, action: PayloadAction<PublicProjectItemUpdate>) => {
      const {contents, contentType, note, task} = action.payload;
      state.contentType = contentType;
      state.contents = contents;
      if (note) {
        state.note = note;
      }
      if (task) {
        state.task = task;
      }
    }
  }
});

export const reducer = slice.reducer;
export const actions = slice.actions;
