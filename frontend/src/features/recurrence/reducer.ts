import { createSlice, PayloadAction } from 'redux-starter-kit';
import RRule, { Frequency } from 'rrule';
import {
  Hourly,
  Daily,
  YearlyOn,
  YearlyOnThe,
  MonthlyOn,
  MonthlyOnThe,
  Weekly,
} from './interface';
import { MONTHS } from './constants';
import moment from 'moment';
import { dateFormat } from '../myBuJo/constants';

export type End = {
  count?: any;
  until?: any;
};

export type FreqAction = {
  freq: Frequency;
};

export type StartDateAction = {
  startDate: string;
  startTime: string;
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

export type RepeatMonthlyOnAction = {
  repeatMonthlyOn: MonthlyOn;
};

export type RepeatMonthlyOnTheAction = {
  repeatMonthlyOnThe: MonthlyOnThe;
};

export type RepeatMonthlyCountAction = {
  repeatMonthlyCount: number;
};

export type RepeatWeeklyCountAction = {
  repeatWeeklyCount: number;
};

export type RepeatWeeklyAction = {
  repeatWeekly: Weekly;
};

export type MonthlyOnAction = {
  monthlyOn: boolean;
};

export type YearlyOnAction = {
  yearlyOn: boolean;
};

export type RRuleStringFromTask = {
  rruleString: string;
};

let initialState = {
  startDate: moment(new Date().toLocaleString('fr-CA'), dateFormat).format(
    dateFormat
  ),
  startTime: '00:00',
  endDate: moment(new Date().toLocaleString('fr-CA'), dateFormat).format(
    dateFormat
  ),
  endCount: 1,
  repeatHourly: { interval: 1 } as Hourly,
  repeatDaily: { interval: 1 } as Daily,
  yearlyOn: true,
  monthlyOn: true,
  repeatYearlyOn: { month: 'Jan', day: 1 } as YearlyOn,
  repeatYearlyOnThe: {
    month: 'Jan',
    day: 'Monday',
    which: 'First',
  } as YearlyOnThe,
  repeatMonthlyOn: {
    day: 1,
  } as MonthlyOn,
  repeatMonthlyOnThe: {
    day: 'Monday',
    which: 'First',
  } as MonthlyOnThe,
  repeatMonthlyCount: 1,
  repeatWeeklyCount: 1,
  repeatWeekly: {
    mon: false,
    tue: false,
    wed: false,
    thu: false,
    fri: false,
    sat: false,
    sun: false,
  } as Weekly,
  start: {},
  repeat: {},
  end: {} as End,
  rRuleString: '',
  freq: Frequency.WEEKLY,
};

const slice = createSlice({
  name: 'rRule',
  initialState,
  reducers: {
    updateFreq: (state, action: PayloadAction<FreqAction>) => {
      const { freq } = action.payload;
      state.freq = freq;
    },

    updateStart: (state, action: PayloadAction<StartDateAction>) => {
      const { startDate, startTime } = action.payload;
      state.startDate = startDate;
      state.startTime = startTime;
      //update rrule start string
      const start = {
        dtstart: moment(
          new Date(startDate + 'T' + startTime + ':00+00:00')
        ).toDate(),
      };

      state.start = start;
      console.log('start reducer');
      state.rRuleString = new RRule({
        ...start,
        ...state.repeat,
        ...state.end,
      }).toString();
      console.log(state.rRuleString);
    },

    updateMonthlyOn: (state, action: PayloadAction<MonthlyOnAction>) => {
      const { monthlyOn } = action.payload;
      state.monthlyOn = monthlyOn;
    },
    updateYearlyOn: (state, action: PayloadAction<YearlyOnAction>) => {
      const { yearlyOn } = action.payload;
      state.yearlyOn = yearlyOn;
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
        //end until use date type because .toText only recognize Date() type
        end.until = new Date(endDate);
      }
      state.end = end;
      console.log('end reducer');
      state.rRuleString = new RRule({
        ...state.start,
        ...state.repeat,
        ...end,
      }).toString();
      console.log(state.rRuleString);
    },
    updateRepeatHourly: (state, action: PayloadAction<RepeatHourlyAction>) => {
      const { repeatHourly } = action.payload;
      state.repeatHourly = repeatHourly;
      //update rrule end string here
      const repeat = { freq: RRule.HOURLY, interval: repeatHourly.interval };
      state.repeat = repeat;
      console.log('hourly reducer');
      state.rRuleString = new RRule({
        ...state.start,
        ...repeat,
        ...state.end,
      }).toString();
    },
    updateRepeatDaily: (state, action: PayloadAction<RepeatDailyAction>) => {
      const { repeatDaily } = action.payload;
      state.repeatDaily = repeatDaily;
      //update rrule end string here
      const repeat = { freq: RRule.DAILY, interval: repeatDaily.interval };
      state.repeat = repeat;
      console.log('repeatly reducer');
      state.rRuleString = new RRule({
        ...state.start,
        ...repeat,
        ...state.end,
      }).toString();
    },
    updateRepeatYearlyOn: (
      state,
      action: PayloadAction<RepeatYearlyOnAction>
    ) => {
      const { repeatYearlyOn } = action.payload;
      state.repeatYearlyOn = repeatYearlyOn;
      //update rrule end string here
      const repeat = {
        freq: RRule.YEARLY,
        bymonth: MONTHS.indexOf(repeatYearlyOn.month) + 1,
        bymonthday: repeatYearlyOn.day,
      };
      state.repeat = repeat;
      console.log('repeat reducer');
      state.rRuleString = new RRule({
        ...state.start,
        ...repeat,
        ...state.end,
      }).toString();
      console.log(state.rRuleString);
    },
    updateRepeatYearlyOnThe: (
      state,
      action: PayloadAction<RepeatYearlyOnTheAction>
    ) => {
      const { repeatYearlyOnThe } = action.payload;
      state.repeatYearlyOnThe = repeatYearlyOnThe;
      //update rrule end string here
      const repeat = {
        freq: RRule.YEARLY,
        bysetpos: 0,
        byweekday: [0],
        bymonth: 1,
      };
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
      state.repeat = repeat;
      console.log('yearly reducer');
      state.rRuleString = new RRule({
        ...state.start,
        ...repeat,
        ...state.end,
      }).toString();
    },
    updateRepeatMonthlyOn: (
      state,
      action: PayloadAction<RepeatMonthlyOnAction>
    ) => {
      const { repeatMonthlyOn } = action.payload;
      state.repeatMonthlyOn = repeatMonthlyOn;
      //update rrule end string here
      const repeat = {
        freq: RRule.MONTHLY,
        interval: state.repeatMonthlyCount,
        bymonthday: repeatMonthlyOn.day,
      };
      state.repeat = repeat;
      console.log('monthly reducer');
      state.rRuleString = new RRule({
        ...state.start,
        ...repeat,
        ...state.end,
      }).toString();
    },
    updateRepeatMonthlyOnThe: (
      state,
      action: PayloadAction<RepeatMonthlyOnTheAction>
    ) => {
      const { repeatMonthlyOnThe } = action.payload;
      state.repeatMonthlyOnThe = repeatMonthlyOnThe;
      //update rrule end string here
      const repeat = {
        freq: RRule.MONTHLY,
        interval: state.repeatMonthlyCount,
        bysetpos: 1,
        byweekday: [0],
      };

      switch (repeatMonthlyOnThe.which) {
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

      switch (repeatMonthlyOnThe.day) {
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
      state.repeat = repeat;
      state.rRuleString = new RRule({
        ...state.start,
        ...repeat,
        ...state.end,
      }).toString();
    },
    updateRepeatMonthlyCount: (
      state,
      action: PayloadAction<RepeatMonthlyCountAction>
    ) => {
      const { repeatMonthlyCount } = action.payload;
      state.repeatMonthlyCount = repeatMonthlyCount;
      //update rrule end string here
      let update = {
        ...state.repeat,
        freq: RRule.MONTHLY,
        interval: repeatMonthlyCount,
      };
      state.repeat = update;
      console.log('monthly count reducer');
      state.rRuleString = new RRule({
        ...state.start,
        ...update,
        ...state.end,
      }).toString();
    },
    updateRepeatWeeklyCount: (
      state,
      action: PayloadAction<RepeatWeeklyCountAction>
    ) => {
      const { repeatWeeklyCount } = action.payload;

      state.repeatWeeklyCount = repeatWeeklyCount;
      //update rrule end string here
      let update = { ...state.repeat, interval: repeatWeeklyCount };
      state.repeat = update;
      console.log('weekly reducer');
      state.rRuleString = new RRule({
        ...state.start,
        ...update,
        ...state.end,
      }).toString();
    },
    updateRepeatWeekly: (state, action: PayloadAction<RepeatWeeklyAction>) => {
      const { repeatWeekly } = action.payload;
      state.repeatWeekly = repeatWeekly;
      //update rrule end string here
      let byweekday = [];
      if (repeatWeekly.mon) byweekday.push(0);
      if (repeatWeekly.tue) byweekday.push(1);
      if (repeatWeekly.wed) byweekday.push(2);
      if (repeatWeekly.thu) byweekday.push(3);
      if (repeatWeekly.fri) byweekday.push(4);
      if (repeatWeekly.sat) byweekday.push(5);
      if (repeatWeekly.sun) byweekday.push(6);
      const repeat = {
        freq: RRule.WEEKLY,
        interval: state.repeatWeeklyCount,
        byweekday: byweekday,
      };
      state.repeat = repeat;
      console.log('repeat weekly reducer');
      state.rRuleString = new RRule({
        ...state.start,
        ...repeat,
        ...state.end,
      }).toString();
    },
    updateRRuleString: (state, action: PayloadAction<RRuleStringFromTask>) => {
      const { rruleString } = action.payload;
      console.log('start reducer');

      state.rRuleString = rruleString;
      const rule = RRule.fromString(rruleString);
      state.freq = rule.options.freq;
    },
  },
});

export const reducer = slice.reducer;
export const actions = slice.actions;
