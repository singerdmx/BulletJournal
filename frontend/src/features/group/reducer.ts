import { createSlice, PayloadAction } from 'redux-starter-kit';

export type ApiErrorAction = {
  error: string;
};

export type UpdateGroups = Group[];

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
    groupsApiErrorReceived: (state, action: PayloadAction<ApiErrorAction>) =>
      state,
    groupsUpdate: (state, action: PayloadAction<UpdateGroups>) => state
  }
});

export const updateGroups = () => actions.groupsUpdate([]);

export const reducer = slice.reducer;
export const actions = slice.actions;
