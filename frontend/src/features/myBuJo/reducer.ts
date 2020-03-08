import { createSlice, PayloadAction } from 'redux-starter-kit';
import { ProjectItems } from './interface';
import {ProjectType} from "../project/constants";

export type MyBuJo = {
  startDate: string;
  endDate: string;
};

export type ApiErrorAction = {
  error: string;
};

export type GetProjectItemsAction = {
  types: ProjectType[];
  startDate: string;
  endDate: string;
  timezone: string;
}

export type ProjectItemsReceivedAction = {
  items: ProjectItems[];
}

let initialState = {
  startDate: '',
  endDate: '',
  projectItems: [] as ProjectItems[]
};

const slice = createSlice({
  name: 'myBuJo',
  initialState,
  reducers: {
    projectItemsApiErrorReceived: (state, action: PayloadAction<ApiErrorAction>) =>
        state,
    datesReceived: (state, action: PayloadAction<MyBuJo>) => {
      const { startDate, endDate } = action.payload;
      state.startDate = startDate;
      state.endDate = endDate;
    },
    getProjectItems: (state, action: PayloadAction<GetProjectItemsAction>) => state,
    projectItemsReceived: (state, action: PayloadAction<ProjectItemsReceivedAction>) => {
      const { items } = action.payload;
      state.projectItems = items;
    },
  }
});

export const reducer = slice.reducer;
export const actions = slice.actions;
