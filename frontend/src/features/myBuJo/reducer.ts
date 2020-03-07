import { createSlice, PayloadAction } from 'redux-starter-kit';

export type MyBuJo = {
  startDate: string;
  endDate: string;
};

let initialState = {
  startDate: '',
  endDate: ''
};

const slice = createSlice({
  name: 'myBuJo',
  initialState,
  reducers: {
    datesReceived: (state, action: PayloadAction<MyBuJo>) => {
      const { startDate, endDate } = action.payload;
      state.startDate = startDate;
      state.endDate = endDate;
    }
  }
});

export const reducer = slice.reducer;
export const actions = slice.actions;
