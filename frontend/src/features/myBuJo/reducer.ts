import { createSlice, PayloadAction } from 'redux-starter-kit';
import { ProjectItems } from './interface';
import { ProjectType } from '../project/constants';

export type MyBuJo = {
  startDate: string;
  endDate: string;
};

export type UpdateSelectedAction = {
  todoSelected: boolean;
  ledgerSelected: boolean;
};

export type ApiErrorAction = {
  error: string;
};

export type GetProjectItemsAction = {
  types: ProjectType[];
  startDate: string;
  endDate: string;
  timezone: string;
};

export type GetProjectItemsAfterUpdateSelectAction = {
  todoSelected: boolean;
  ledgerSelected: boolean;
  startDate: string;
  endDate: string;
  timezone: string;
};

export type ProjectItemsReceivedAction = {
  items: ProjectItems[];
};

let initialState = {
  startDate: '',
  endDate: '',
  projectItems: [] as ProjectItems[],
  todoSelected: true,
  ledgerSelected: false
};

const slice = createSlice({
  name: 'myBuJo',
  initialState,
  reducers: {
    projectItemsApiErrorReceived: (
      state,
      action: PayloadAction<ApiErrorAction>
    ) => state,
    datesReceived: (state, action: PayloadAction<MyBuJo>) => {
      const { startDate, endDate } = action.payload;
      state.startDate = startDate;
      state.endDate = endDate;
    },
    updateSelected: (state, action: PayloadAction<UpdateSelectedAction>) => {
      const { todoSelected, ledgerSelected } = action.payload;
      state.todoSelected = todoSelected;
      state.ledgerSelected = ledgerSelected;
    },
    getProjectItems: (state, action: PayloadAction<GetProjectItemsAction>) =>
      state,
    getProjectItemsAfterUpdateSelect: (
      state,
      action: PayloadAction<GetProjectItemsAfterUpdateSelectAction>
    ) => state,
    projectItemsReceived: (
      state,
      action: PayloadAction<ProjectItemsReceivedAction>
    ) => {
      const { items } = action.payload;
      state.projectItems = items;
    }
  }
});

export const reducer = slice.reducer;
export const actions = slice.actions;
