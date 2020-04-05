import { createSlice, PayloadAction } from 'redux-starter-kit';

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

let initialState = {
  groupsEtag: '',
  notificationsEtag: '',
  ownedProjectsEtag: '',
  sharedProjectsEtag: ''
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
    systemUpdate: (state, action: PayloadAction<UpdateSystem>) => state
  }
});

export const reducer = slice.reducer;
export const actions = slice.actions;
