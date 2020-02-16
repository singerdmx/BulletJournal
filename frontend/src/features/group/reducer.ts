import { createSlice, PayloadAction } from 'redux-starter-kit';

export type ApiErrorAction = {
  error: string;
};

export type UpdateGroups = {};

export type User = {
  accepted: boolean;
  avatar: string;
  id: number;
  name: string;
  thumbnail: string;
};

export type Group = {
  id: number;
  name: string;
  owner: string;
  users: User[];
};

export type GroupsAction = {
  groups: Group[];
};

export type GroupCreateAction = {
  name: string
}

let initialState = {
  groups: [] as Group[]
};

const slice = createSlice({
  name: 'groups',
  initialState,
  reducers: {
    groupsReceived: (state, action: PayloadAction<GroupsAction>) => {
      const { groups } = action.payload;
      state.groups = groups;
    },
    groupsApiErrorReceived: (state, action: PayloadAction<ApiErrorAction>) =>state,
    groupsUpdate: (state, action: PayloadAction<UpdateGroups>) => state,
    createGroup: (state, action: PayloadAction<GroupCreateAction>) => state
  }
});

export const reducer = slice.reducer;
export const actions = slice.actions;
