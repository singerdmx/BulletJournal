import { createSlice, PayloadAction } from 'redux-starter-kit';
import { Label } from './interfaces';

export type ApiErrorAction = {
  error: string;
};

export type LabelsAction = {
  labels: Label[];
  etag: string;
};

export type GroupUpdateAction = {};

export type LabelCreateAction = {
  value: string;
};

export type DeleteLabelAction = {
  labelId: number;
  value: string;
};

export type GetGroupAction = {
  groupId: number;
  hideError?: boolean;
};

export type PatchLabelAction = {
  labelId: number;
  value: string;
};

export type UpdateLabels = {};

export type SelectedLabelAction = {
  val: string;
}

let initialState = {
  labels: [] as Label[],
  labelsSelected: [] as Label[],
  labelOptions: [] as Label[],
  etag: '',
  label: {} as Label
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
      state.labelOptions = Object.assign([], labels);
      state.labelsSelected = [];
    },
    addSelectedLabel: (state, action: PayloadAction<SelectedLabelAction>) => {
      const { val } = action.payload;
      const label = state.labelOptions.filter(l => l.value === val)[0];
      state.labelsSelected.unshift(label);
      state.labelOptions = state.labelOptions.filter(l => l.value !== val);
    },
    removeSelectedLabel: (state, action: PayloadAction<SelectedLabelAction>) => {
      const { val } = action.payload;
      const label = state.labelsSelected.filter(l => l.value === val)[0];
      state.labelOptions.unshift(label);
      state.labelsSelected = state.labelsSelected.filter(l => l.value !== val);
    },
    labelsUpdate: (state, action: PayloadAction<UpdateLabels>) => state,
    labelsApiErrorReceived: (state, action: PayloadAction<ApiErrorAction>) =>
      state,
    createLabel: (state, action: PayloadAction<LabelCreateAction>) => state,
    deleteLabel: (state, action: PayloadAction<DeleteLabelAction>) => state,
    patchLabel: (state, action: PayloadAction<PatchLabelAction>) => state,
  }
});

export const reducer = slice.reducer;
export const actions = slice.actions;
