import { createSlice, PayloadAction } from 'redux-starter-kit';
import { Label } from './interface';
import { ProjectItems } from '../myBuJo/interface';

export type ApiErrorAction = {
  error: string;
};

export type LabelsAction = {
  labels: Label[];
  etag: string;
};

export type ProjectLabelsAction = {
  labels: Label[];
};

export type LabelCreateAction = {
  value: string;
  icon: string;
};

export type DeleteLabelAction = {
  labelId: number;
  value: string;
};

export type GetItemsByLabelsAction = {
  labels: number[];
};

export type PatchLabelAction = {
  labelId: number;
  value?: string;
  icon?: string;
};

export type UpdateLabels = {
  projectId?: number;
};

export type UpdateProjectLabels = {
  projectId: number;
  projectShared: boolean;
};

export type SelectedLabelAction = {
  label: Label;
};

export type ItemsByLabelsAction = {
  items: ProjectItems[];
};

let initialState = {
  labels: [] as Label[],
  labelsSelected: [] as Label[],
  labelOptions: [] as Label[],
  etag: '',
  label: {} as Label,
  items: [] as ProjectItems[],
  projectLabels: [] as Label[],
};

const slice = createSlice({
  name: 'labels',
  initialState,
  reducers: {
    labelsReceived: (state, action: PayloadAction<LabelsAction>) => {
      const { labels, etag } = action.payload;
      state.labels = labels;
      if (etag && etag.length > 0) {
        state.etag = etag;
      }

      const labelOptions = [...labels];

      state.labelsSelected.forEach((label) => {
        if (!labelOptions.includes(label)) {
          labelOptions.unshift(label);
        }
      });
      let s = new Set();
      let array = [] as Label[];
      labelOptions.forEach((l) => {
        if (!s.has(l.id)) {
          array.unshift(l);
          s.add(l.id);
        }
      });
      state.labelOptions = array;

      s = new Set();
      array = [] as Label[];
      state.labelsSelected.forEach((l) => {
        if (!s.has(l.id)) {
          array.unshift(l);
          s.add(l.id);
        }
      });

      state.labelsSelected = array;
    },
    projectLabelsReceived: (
      state,
      action: PayloadAction<ProjectLabelsAction>
    ) => {
      const { labels } = action.payload;
      state.projectLabels = labels;
    },
    setSelectedLabel: (state, action: PayloadAction<SelectedLabelAction>) => {
      const { label } = action.payload;
      state.labelsSelected = [label];
    },
    labelsUpdate: (state, action: PayloadAction<UpdateLabels>) => state,
    projectLabelsUpdate: (state, action: PayloadAction<UpdateProjectLabels>) =>
      state,
    labelsApiErrorReceived: (state, action: PayloadAction<ApiErrorAction>) =>
      state,
    createLabel: (state, action: PayloadAction<LabelCreateAction>) => state,
    deleteLabel: (state, action: PayloadAction<DeleteLabelAction>) => state,
    patchLabel: (state, action: PayloadAction<PatchLabelAction>) => state,
    getItemsByLabels: (state, action: PayloadAction<GetItemsByLabelsAction>) =>
      state,
    itemsByLabelsReceived: (
      state,
      action: PayloadAction<ItemsByLabelsAction>
    ) => {
      const { items } = action.payload;
      state.items = items;
    },
  },
});

export const reducer = slice.reducer;
export const actions = slice.actions;
