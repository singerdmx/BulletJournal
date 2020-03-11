import { createSlice, PayloadAction } from 'redux-starter-kit';
import moment from 'moment';
import RRule from 'rrule';

export type End = {
  count?: any;
  until?: any;
};

export type StartDateAction = {
  startDate: string;
};

export type EndDateAction = {
  mode: string;
  endDate: string;
  endCount: number;
};

let initialState = {
  startDate: '',
  rRuleStartString: '',
  endDate: '',
  endCount: 0,
  rRuleEndString: ''
};

const slice = createSlice({
  name: 'rRule',
  initialState,
  reducers: {
    updateStart: (state, action: PayloadAction<StartDateAction>) => {
      const { startDate } = action.payload;
      state.startDate = startDate;
      //update rrule start string
      const test = { dtstart: moment(startDate).toDate() };
      state.rRuleStartString = new RRule(test).toString();
    },
    updateEnd: (state, action: PayloadAction<EndDateAction>) => {
      const { endDate, endCount, mode } = action.payload;
      console.log(mode);
      state.endDate = endDate;
      state.endCount = endCount;
      //update rrule end string here
      let end = {} as End;
      if (mode === 'After') {
        end.count = endCount;
      } else if (mode === 'On date') {
        end.until = moment(endDate).format();
      }
      state.rRuleEndString = new RRule(end).toString();
    }
  }
});

export const reducer = slice.reducer;
export const actions = slice.actions;
