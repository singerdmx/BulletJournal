import { createSlice, PayloadAction } from 'redux-starter-kit';
import {
  Role,
  LockedUser,
  LockedIP,
  UserInfo,
  CategorySteps,
  ChoiceMetadata,
  SelectionMetadata,
  StepMetadata
} from './interface';
import { User } from '../group/interface';

export type setRoleAction = {
  username: string;
  role: Role;
};

export type ChangePointsAction = {
  username: string;
  points: number;
  description: string;
};

export type SetPointsAction = {
  username: string;
  points: number;
};

export type UserRolesAction = {
  usersByRole: User[];
};

export type GetUsersByRoleAction = {
  role: Role;
};

export type GetUserInfoAction = {
  username: string;
};

export type LockedUsersAction = {
  lockedUsers: LockedUser[];
};

export type LockedIPsAction = {
  lockedIPs: LockedIP[];
};

export type UnlockUserAndIPAction = {
  name: string;
  ip: string;
};

export type LockUserAndIPAction = {
  name: string;
  ip: string;
  reason: string;
};

export type UserInfoAction = {
  userInfo: UserInfo;
};

export type UserInfoPointsAction = {
  points: number;
};

export type GetLockedUsersAndIPsAction = {};

export type GetCategoryStepsAction = {
  categoryId: number;
};

export type CategoryStepsAction = {
  categorySteps: CategorySteps;
};

export type ApproveSampleTaskAction = {
  sampleTaskId: number;
  choiceId: number;
  selections: number[];
};

export type ChoiceMetadataAction = {
  choiceMetadata: ChoiceMetadata[];
}

export type SelectionMetadataAction = {
  selectionMetadata: SelectionMetadata[];
}

export type StepMetadataAction = {
  stepMetadata: StepMetadata[];
}

export type GetMetadataAction = {};

export type UpdateChoiceMetadataAction = {
  keyword: string;
  choiceId: number;
};

export type UpdateSelectionMetadataAction = {
  keyword: string;
  selectionId: number;
  frequency?: number;
};

export type UpdateStepMetadataAction = {
  keyword: string;
  stepId: number;
};

export type RemoveMetadataAction = {
  keywords: string[];
};

export type AddMetadataAction = {
  id: number;
  keyword: string;
};

let initialState = {
  usersByRole: [] as User[],
  lockedUsers: [] as LockedUser[],
  lockedIPs: [] as LockedIP[],
  userInfo: {} as UserInfo,
  categorySteps: undefined as CategorySteps | undefined,
  choiceMetadata: [] as ChoiceMetadata[],
  selectionMetadata: [] as SelectionMetadata[],
  stepMetadata: [] as StepMetadata[],
};

const slice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    userInfoReceived: (state, action: PayloadAction<UserInfoAction>) => {
      const { userInfo } = action.payload;
      state.userInfo = userInfo;
    },
    userInfoPointsReceived: (
      state,
      action: PayloadAction<UserInfoPointsAction>
    ) => {
      const { points } = action.payload;
      state.userInfo.points = points;
    },
    setRole: (state, action: PayloadAction<setRoleAction>) => state,
    changePoints: (state, action: PayloadAction<ChangePointsAction>) => state,
    setPoints: (state, action: PayloadAction<SetPointsAction>) => state,
    userRolesReceived: (state, action: PayloadAction<UserRolesAction>) => {
      const { usersByRole } = action.payload;
      state.usersByRole = usersByRole;
    },
    getUsersByRole: (state, action: PayloadAction<GetUsersByRoleAction>) =>
      state,
    getUserInfo: (state, action: PayloadAction<GetUserInfoAction>) => state,
    lockedUsersReceived: (state, action: PayloadAction<LockedUsersAction>) => {
      const { lockedUsers } = action.payload;
      state.lockedUsers = lockedUsers;
    },
    lockedIPsReceived: (state, action: PayloadAction<LockedIPsAction>) => {
      const { lockedIPs } = action.payload;
      state.lockedIPs = lockedIPs;
    },
    getLockedUsersAndIPs: (
      state,
      action: PayloadAction<GetLockedUsersAndIPsAction>
    ) => state,
    unlockUserandIP: (state, action: PayloadAction<UnlockUserAndIPAction>) =>
      state,
    lockUserandIP: (state, action: PayloadAction<LockUserAndIPAction>) => state,
    getCategorySteps: (state, action: PayloadAction<GetCategoryStepsAction>) => state,
    categoryStepsReceived: (state, action: PayloadAction<CategoryStepsAction>) => {
      const { categorySteps } = action.payload;
      state.categorySteps = categorySteps;
    },
    approveSampleTask: (state, action: PayloadAction<ApproveSampleTaskAction>) => state,
    choiceMetadataReceived: (state, action: PayloadAction<ChoiceMetadataAction>) => {
      const { choiceMetadata } = action.payload;
      state.choiceMetadata = choiceMetadata;
    },
    getChoiceMetadata: (state, action: PayloadAction<GetMetadataAction>) => state,
    updateChoiceMetadata: (state, action: PayloadAction<UpdateChoiceMetadataAction>) => state,
    removeChoiceMetadata: (state, action: PayloadAction<RemoveMetadataAction>) => state,
    selectionMetadataReceived: (state, action: PayloadAction<SelectionMetadataAction>) => {
      const { selectionMetadata } = action.payload;
      state.selectionMetadata = selectionMetadata;
    },
    getSelectionMetadata: (state, action: PayloadAction<GetMetadataAction>) => state,
    updateSelectionMetadata: (state, action: PayloadAction<UpdateSelectionMetadataAction>) => state,
    removeSelectionMetadata: (state, action: PayloadAction<RemoveMetadataAction>) => state,
    stepMetadataReceived: (state, action: PayloadAction<StepMetadataAction>) => {
      const { stepMetadata } = action.payload;
      state.stepMetadata = stepMetadata;
    },
    getStepMetadata: (state, action: PayloadAction<GetMetadataAction>) => state,
    updateStepMetadata: (state, action: PayloadAction<UpdateStepMetadataAction>) => state,
    removeStepMetadata: (state, action: PayloadAction<RemoveMetadataAction>) => state,
    addStepMetadata: (state, action: PayloadAction<AddMetadataAction>) => state,
    addSelectionMetadata: (state, action: PayloadAction<AddMetadataAction>) => state,
    addChoiceMetadata: (state, action: PayloadAction<AddMetadataAction>) => state,
  },
});

export const reducer = slice.reducer;
export const actions = slice.actions;
