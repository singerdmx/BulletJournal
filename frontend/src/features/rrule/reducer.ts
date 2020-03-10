import { createSlice, PayloadAction } from 'redux-starter-kit';
import moment from 'moment';
import RRule from 'rrule';

export type StartDateAction = {
  startDate: string;
};

let initialState = {
  startDate: '',
  rRuleStartString: ''
};

const slice = createSlice({
  name: 'rRule',
  initialState,
  reducers: {
    updateStart: (state, action: PayloadAction<StartDateAction>) => {
      const { startDate } = action.payload;
      //update rrule start string
      const test = { dtstart: moment(startDate).toDate() };
      state.rRuleStartString = new RRule(test).toString();
      state.startDate = startDate;
    }
  }
});

export const reducer = slice.reducer;
export const actions = slice.actions;
