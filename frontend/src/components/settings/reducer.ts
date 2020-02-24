import { createSlice, PayloadAction } from 'redux-starter-kit';

type TimezoneSaveButtonAction = {
  timezoneSaveButtonVisible: boolean;
};

type BeforeSaveButtonAction = {
  beforeSaveButtonVisible: boolean;
};

export enum ReminderBeforeTask {
  ZERO_MIN_BEFORE = 0,
  FIVE_MIN_BEFORE = 1,
  TEN_MIN_BEFORE = 2,
  THIRTY_MIN_BEFORE = 3,
  ONE_HR_BEFORE = 4,
  TWO_HR_BEFORE = 5,
  NONE = 6
}

export const ReminderBeforeTaskText = [
  '0 minute before',
  '5 minutes before',
  '10 minutes before',
  '30 minutes before',
  '1 hour before',
  '2 hours before',
  'No reminder'
];

let initialState = {
  timezoneSaveButtonVisible: false,
  beforeSaveButtonVisible: false
};

const slice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    updateTimezoneSaveButtonVisiblility: (
      state,
      action: PayloadAction<TimezoneSaveButtonAction>
    ) => {
      const { timezoneSaveButtonVisible } = action.payload;
      state.timezoneSaveButtonVisible = timezoneSaveButtonVisible;
    },
    updateBeforeSaveButtonVisiblility: (
      state,
      action: PayloadAction<BeforeSaveButtonAction>
    ) => {
      const { beforeSaveButtonVisible } = action.payload;
      state.beforeSaveButtonVisible = beforeSaveButtonVisible;
    }
  }
});

export const reducer = slice.reducer;
export const actions = slice.actions;
