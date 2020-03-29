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

export type UpdateLabels = {};

export type SelectedLabelAction = {
  label: Label;
}

export type ItemsByLabelsAction = {
  items: ProjectItems[];
}

let initialState = {
  labels: [] as Label[],
  labelsSelected: [] as Label[],
  labelOptions: [] as Label[],
  etag: '',
  label: {} as Label,
  items: [] as ProjectItems[],
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
      const { label } = action.payload;
      const selectedLabel = state.labelOptions.filter(l => l.value === label.value)[0];
      state.labelsSelected.unshift(selectedLabel);
      state.labelOptions = state.labelOptions.filter(l => l.value !== label.value);
    },
    removeSelectedLabel: (state, action: PayloadAction<SelectedLabelAction>) => {
      const { label } = action.payload;
      const selectedLabel = state.labelsSelected.filter(l => l.value === label.value)[0];
      state.labelOptions.unshift(selectedLabel);
      state.labelsSelected = state.labelsSelected.filter(l => l.value !== label.value);
    },
    labelsUpdate: (state, action: PayloadAction<UpdateLabels>) => state,
    labelsApiErrorReceived: (state, action: PayloadAction<ApiErrorAction>) =>
      state,
    createLabel: (state, action: PayloadAction<LabelCreateAction>) => state,
    deleteLabel: (state, action: PayloadAction<DeleteLabelAction>) => state,
    patchLabel: (state, action: PayloadAction<PatchLabelAction>) => state,
    getItemsByLabels: (state, action: PayloadAction<GetItemsByLabelsAction>) => state,
    itemsByLabelsReceived: (state, action: PayloadAction<ItemsByLabelsAction>) => {
      const { items } = action.payload;
      state.items = items;
    }
  }
});

export const reducer = slice.reducer;
export const actions = slice.actions;
