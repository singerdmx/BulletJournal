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
  name: string;
};

export type DeleteLabelAction = {
  labelId: number;
  name: string;
};

export type GetGroupAction = {
  groupId: number;
  hideError?: boolean;
};

export type PatchLabelAction = {
  labelId: number;
  name: string;
};

export type UpdateLabels = {};

let initialState = {
  labels: [] as Label[],
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
