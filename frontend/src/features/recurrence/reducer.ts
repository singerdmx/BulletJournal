import {createSlice, PayloadAction} from 'redux-starter-kit';
import RRule, {Frequency} from 'rrule';
import {bySetPosMap, byWeekDayMap, MonthlyOn, MonthlyOnThe, Weekly, YearlyOn, YearlyOnThe,} from './interface';
import {MONTHS} from './constants';
import moment from 'moment';
import {dateFormat} from '../myBuJo/constants';
import {Task} from "../tasks/interface";
import {getBySetPosWhich, getByWeekDay} from "./actions";

export type End = {
  count: number | null;
  until: Date | null;
};

export type FreqAction = {
  freq: Frequency;
};

export type StartDateAction = {
  startDate: string;
  startTime: string;
};

export type EndDateAction = {
  endDate: string | null;
  endCount: number | null;
};

export type RepeatHourlyAction = {
  repeatHourly: number;
};

export type RepeatDailyAction = {
  repeatDaily: number;
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
  task: Task;
};

export const defaultDate = moment(new Date().toLocaleString('fr-CA'), dateFormat).format(dateFormat);
const defaultTime = '00:00';
const defaultStart = moment(
    new Date(defaultDate + 'T' + defaultTime + ':00+00:00')
).toDate();
const defaultRepeat = {
  freq: Frequency.DAILY,
  interval: 1,
  byweekday: [],
} as any;

let initialState = {
  startDate: defaultDate,
  startTime: defaultTime,
  yearlyOn: true,
  monthlyOn: true,
  repeatYearlyOn: {month: 'Jan', day: 1} as YearlyOn,
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
  repeatWeekly: {
    mon: false,
    tue: false,
    wed: false,
    thu: false,
    fri: false,
    sat: false,
    sun: false,
  } as Weekly,
  start: {dtstart: defaultStart},
  end: {} as End,
  repeat: defaultRepeat,
  rRuleString: new RRule({
    dtstart: defaultStart,
    ...defaultRepeat,
  }).toString(),
};

const slice = createSlice({
  name: 'rRule',
  initialState,
  reducers: {
    updateFreq: (state, action: PayloadAction<FreqAction>) => {
      const {freq} = action.payload;
      state.repeat.freq = freq;
    },

    updateStart: (state, action: PayloadAction<StartDateAction>) => {
      const {startDate, startTime} = action.payload;
      state.startDate = startDate;
      state.startTime = startTime;
      state.start = {
        dtstart: moment(
            new Date(startDate + 'T' + startTime + ':00+00:00')
        ).toDate(),
      };
      state.rRuleString = new RRule({
        ...state.start,
        ...state.repeat,
        ...state.end,
      }).toString();
    },

    updateMonthlyOn: (state, action: PayloadAction<MonthlyOnAction>) => {
      const {monthlyOn} = action.payload;
      state.monthlyOn = monthlyOn;
    },
    updateYearlyOn: (state, action: PayloadAction<YearlyOnAction>) => {
      const {yearlyOn} = action.payload;
      state.yearlyOn = yearlyOn;
    },
    updateEnd: (state, action: PayloadAction<EndDateAction>) => {
      const {endDate, endCount} = action.payload;
      //update rrule end string here
      let end = {} as End;
      if (endCount) {
        end.count = Math.max(1, endCount);
      } else if (endDate) {
        //end until use date type because .toText only recognize Date() type
        const year = parseInt(endDate.substring(0, 4));
        const month = parseInt(endDate.substring(5, 7));
        const day = parseInt(endDate.substring(8, 10));
        end.until = new Date(year, month - 1, day);
      }
      state.end = end;
      state.rRuleString = new RRule({
        ...state.start,
        ...state.repeat,
        ...end,
      }).toString();
    },
    updateRepeatHourly: (state, action: PayloadAction<RepeatHourlyAction>) => {
      const {repeatHourly} = action.payload;
      state.repeat = {
        freq: Frequency.HOURLY,
        interval: Math.max(1, repeatHourly),
      };
      //update rrule end string here
      state.rRuleString = new RRule({
        ...state.start,
        ...state.repeat,
        ...state.end,
      }).toString();
    },
    updateRepeatDaily: (state, action: PayloadAction<RepeatDailyAction>) => {
      const {repeatDaily} = action.payload;
      state.repeat = {
        freq: Frequency.DAILY,
        interval: Math.max(1, repeatDaily)
      };
      //update rrule end string here
      state.rRuleString = new RRule({
        ...state.start,
        ...state.repeat,
        ...state.end,
      }).toString();
    },
    updateRepeatYearlyOn: (
        state,
        action: PayloadAction<RepeatYearlyOnAction>
    ) => {
      const {repeatYearlyOn} = action.payload;
      state.repeatYearlyOn = repeatYearlyOn;
      //update rrule end string here
      state.repeat = {
        freq: RRule.YEARLY,
        bymonth: MONTHS.indexOf(repeatYearlyOn.month) + 1,
        bymonthday: repeatYearlyOn.day,
        interval: 1
      };
      state.yearlyOn = true;
      state.rRuleString = new RRule({
        ...state.start,
        ...state.repeat,
        ...state.end,
      }).toString();
    },
    updateRepeatYearlyOnThe: (
        state,
        action: PayloadAction<RepeatYearlyOnTheAction>
    ) => {
      const {repeatYearlyOnThe} = action.payload;
      state.repeatYearlyOnThe = repeatYearlyOnThe;
      //update rrule end string here
      state.repeat = {
        freq: RRule.YEARLY,
        bysetpos: [bySetPosMap.get(repeatYearlyOnThe.which)],
        byweekday: byWeekDayMap.get(repeatYearlyOnThe.day),
        bymonth: MONTHS.indexOf(repeatYearlyOnThe.month) + 1,
        interval: 1
      };
      state.yearlyOn = false;
      state.rRuleString = new RRule({
        ...state.start,
        ...state.repeat,
        ...state.end,
      }).toString();
    },
    updateRepeatMonthlyOn: (
        state,
        action: PayloadAction<RepeatMonthlyOnAction>
    ) => {
      const {repeatMonthlyOn} = action.payload;
      state.repeatMonthlyOn = repeatMonthlyOn;
      //update rrule end string here
      state.repeat = {
        freq: RRule.MONTHLY,
        interval: state.repeat.interval,
        bymonthday: repeatMonthlyOn.day,
      };
      state.monthlyOn = true;
      state.rRuleString = new RRule({
        ...state.start,
        ...state.repeat,
        ...state.end,
      }).toString();
    },
    updateRepeatMonthlyOnThe: (
        state,
        action: PayloadAction<RepeatMonthlyOnTheAction>
    ) => {
      const {repeatMonthlyOnThe} = action.payload;
      state.repeatMonthlyOnThe = repeatMonthlyOnThe;
      state.monthlyOn = false;
      //update rrule end string here
      state.repeat = {
        freq: RRule.MONTHLY,
        interval: state.repeat.interval,
        bysetpos: bySetPosMap.get(repeatMonthlyOnThe.which),
        byweekday: byWeekDayMap.get(repeatMonthlyOnThe.day),
      };

      state.rRuleString = new RRule({
        ...state.start,
        ...state.repeat,
        ...state.end,
      }).toString();
    },
    updateRepeatMonthlyCount: (
        state,
        action: PayloadAction<RepeatMonthlyCountAction>
    ) => {
      const {repeatMonthlyCount} = action.payload;
      state.repeat.interval = Math.max(1, repeatMonthlyCount);
      state.rRuleString = new RRule({
        ...state.start,
        ...state.repeat,
        ...state.end,
      }).toString();
    },
    updateRepeatWeeklyCount: (
        state,
        action: PayloadAction<RepeatWeeklyCountAction>
    ) => {
      const {repeatWeeklyCount} = action.payload;

      state.repeat = {
        freq: Frequency.WEEKLY,
        interval: repeatWeeklyCount,
        byweekday: state.repeat.byweekday ? state.repeat.byweekday : []
      };
      //update rrule end string here
      state.rRuleString = new RRule({
        ...state.start,
        ...state.repeat,
        ...state.end,
      }).toString();
    },
    updateRepeatWeekly: (state, action: PayloadAction<RepeatWeeklyAction>) => {
      const {repeatWeekly} = action.payload;
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
      state.repeat = {
        freq: Frequency.WEEKLY,
        byweekday: byweekday,
        interval: state.repeat.interval
      };
      state.rRuleString = new RRule({
        ...state.start,
        ...state.repeat,
        ...state.end,
      }).toString();
    },
    updateRRuleString: (state, action: PayloadAction<RRuleStringFromTask>) => {
      const {task} = action.payload;
      const rruleString = task.recurrenceRule;
      console.log(rruleString);

      if (!rruleString.startsWith("DTSTART:")) {
        alert("Invalid rruleString: " + rruleString);
        return;
      }

      state.rRuleString = rruleString;
      const rule = RRule.fromString(rruleString);
      state.repeat = {freq: rule.options.freq, interval: rule.options.interval} as any;
      const which = getBySetPosWhich(rule);
      const day = getByWeekDay(rule);

      switch (state.repeat.freq) {
        case Frequency.WEEKLY:
          state.repeat.byweekday = rule.options.byweekday;
          let i = 0;
          state.repeatWeekly = {
            mon: state.repeat.byweekday.includes(i++),
            tue: state.repeat.byweekday.includes(i++),
            wed: state.repeat.byweekday.includes(i++),
            thu: state.repeat.byweekday.includes(i++),
            fri: state.repeat.byweekday.includes(i++),
            sat: state.repeat.byweekday.includes(i++),
            sun: state.repeat.byweekday.includes(i++),
          };
          break;
        case Frequency.MONTHLY:
          if (rule.options.bysetpos) {
            state.repeatMonthlyOnThe = {
              which: which,
              day: day
            }
            state.monthlyOn = false;
          } else {
            state.repeatMonthlyOn = {
              day: rule.options.bymonthday[0]
            }
            state.monthlyOn = true;
          }
          break;
        case Frequency.YEARLY:
          state.repeat.interval = 1;
          const m = MONTHS[rule.options.bymonth[0] - 1];
          if (rule.options.bysetpos) {
            state.repeatYearlyOnThe = {
              month: m,
              which: which,
              day: day
            }
            state.yearlyOn = false;
          } else {
            state.repeatYearlyOn = {
              month: m,
              day: rule.options.bymonthday[0]
            }
            state.yearlyOn = true;
          }
          break;
      }

      state.startDate = rruleString.substring(8, 12) + '-' + rruleString.substring(12, 14) + '-' + rruleString.substring(14, 16);
      state.startTime = rruleString.substring(17, 19) + ':' + rruleString.substring(19, 21);
      state.start = {
        dtstart: moment(
            new Date(state.startDate + 'T' + state.startTime + ':00+00:00')
        ).toDate(),
      };

      if (rule.options.count) {
        state.end = {count: rule.options.count, until: null};
      } else if (rule.options.until) {
        state.end = {until: rule.options.until, count: null};
      } else {
        state.end = {until: null, count: null};
      }
    },
  },
});

export const reducer = slice.reducer;
export const actions = slice.actions;
