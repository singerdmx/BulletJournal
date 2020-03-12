import { createSlice, PayloadAction } from 'redux-starter-kit';
import moment from 'moment';
import RRule from 'rrule';
import { Hourly, Daily, YearlyOn, YearlyOnThe } from './interface';
import { MONTHS } from './constants';

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

export type RepeatHourlyAction = {
  repeatHourly: Hourly;
};

export type RepeatDailyAction = {
  repeatDaily: Daily;
};

export type RepeatYearlyOnAction = {
  repeatYearlyOn: YearlyOn;
};

export type RepeatYearlyOnTheAction = {
  repeatYearlyOnThe: YearlyOnThe;
};

let initialState = {
  startDate: moment(
    new Date().toLocaleString('fr-CA', { timeZone: 'America/New_York' }),
    'YYYY-MM-DD'
  ).format('YYYY-MM-DD'),
  rRuleStartString: '',
  endDate: moment(
    new Date().toLocaleString('fr-CA', { timeZone: 'America/New_York' }),
    'YYYY-MM-DD'
  ).format('YYYY-MM-DD'),
  endCount: 0,
  rRuleEndString: '',
  repeatHourly: { interval: 0 } as Hourly,
  repeatDaily: { interval: 0 } as Daily,
  repeatYearlyOn: { month: 'Jan', day: 1 } as YearlyOn,
  repeatYearlyOnThe: {
    month: 'Jan',
    day: 'Monday',
    which: 'First'
  } as YearlyOnThe,
  rRuleRepeatString: ''
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
    },
    updateRepeatHourly: (state, action: PayloadAction<RepeatHourlyAction>) => {
      const { repeatHourly } = action.payload;
      state.repeatHourly = repeatHourly;
      //update rrule end string here
      state.rRuleRepeatString = new RRule({
        freq: RRule.HOURLY,
        interval: repeatHourly.interval
      }).toString();
    },
    updateRepeatDaily: (state, action: PayloadAction<RepeatDailyAction>) => {
      const { repeatDaily } = action.payload;
      state.repeatDaily = repeatDaily;
      //update rrule end string here
      state.rRuleRepeatString = new RRule({
        freq: RRule.DAILY,
        interval: repeatDaily.interval
      }).toString();
    },
    updateRepeatYearlyOn: (
      state,
      action: PayloadAction<RepeatYearlyOnAction>
    ) => {
      const { repeatYearlyOn } = action.payload;
      state.repeatYearlyOn = repeatYearlyOn;
      //update rrule end string here
      state.rRuleRepeatString = new RRule({
        freq: RRule.YEARLY,
        bymonth: MONTHS.indexOf(repeatYearlyOn.month) + 1,
        bymonthday: repeatYearlyOn.day
      }).toString();
    },
    updateRepeatYearlyOnThe: (
      state,
      action: PayloadAction<RepeatYearlyOnTheAction>
    ) => {
      const { repeatYearlyOnThe } = action.payload;
      state.repeatYearlyOnThe = repeatYearlyOnThe;
      //update rrule end string here
      const repeat = { bysetpos: 0, byweekday: [0], bymonth: 1 };

      switch (repeatYearlyOnThe.which) {
        case 'First':
          repeat.bysetpos = 1;
          break;
        case 'Second':
          repeat.bysetpos = 2;
          break;
        case 'Third':
          repeat.bysetpos = 3;
          break;
        case 'Fourth':
          repeat.bysetpos = 4;
          break;
        case 'Last':
          repeat.bysetpos = -1;
          break;
        default:
          break;
      }

      switch (repeatYearlyOnThe.day) {
        case 'Monday':
          repeat.byweekday = [0];
          break;
        case 'Tuesday':
          repeat.byweekday = [1];
          break;
        case 'Wednesday':
          repeat.byweekday = [2];
          break;
        case 'Thursday':
          repeat.byweekday = [3];
          break;
        case 'Friday':
          repeat.byweekday = [4];
          break;
        case 'Saturday':
          repeat.byweekday = [5];
          break;
        case 'Sunday':
          repeat.byweekday = [6];
          break;
        case 'Day':
          repeat.byweekday = [0, 1, 2, 3, 4, 5, 6];
          break;
        case 'Weekday':
          repeat.byweekday = [0, 1, 2, 3, 4];
          break;
        case 'Weekend day':
          repeat.byweekday = [5, 6];
          break;
        default:
          break;
      }

      repeat.bymonth = MONTHS.indexOf(repeatYearlyOnThe.month) + 1;
      state.rRuleRepeatString = new RRule({
        freq: RRule.YEARLY,
        ...repeat
      }).toString();
    }
  }
});

export const reducer = slice.reducer;
export const actions = slice.actions;
