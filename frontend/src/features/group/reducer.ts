import { createSlice, PayloadAction } from "redux-starter-kit";

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

export type GroupsWithOwner = {
  owner: string;
  groups: Group[];
};

export type GroupsAction = {
  groups: GroupsWithOwner[];
  etag: string;
};

export type GroupCreateAction = {
  name: string;
};

export type AddUserGroupAction = {
  groupId: number;
  username: string;
};

export type RemoveUserGroupAction = {
  groupId: number;
  username: string;
};

let initialState = {
  groups: [] as GroupsWithOwner[],
  etag: ""
};

const slice = createSlice({
  name: "groups",
  initialState,
  reducers: {
    groupsReceived: (state, action: PayloadAction<GroupsAction>) => {
      const { groups, etag } = action.payload;
      state.groups = groups;
      state.etag = etag;
    },
    groupsApiErrorReceived: (state, action: PayloadAction<ApiErrorAction>) =>
      state,
    groupsUpdate: (state, action: PayloadAction<UpdateGroups>) => state,
    createGroup: (state, action: PayloadAction<GroupCreateAction>) => state,
    addUserGroup: (state, action: PayloadAction<AddUserGroupAction>) => state,
    removeUserGroup: (state, action: PayloadAction<RemoveUserGroupAction>) =>
      state
  }
});

export const reducer = slice.reducer;
export const actions = slice.actions;
