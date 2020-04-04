import { actions } from './reducer';
import {
  Hourly,
  Daily,
  YearlyOn,
  YearlyOnThe,
  MonthlyOn,
  MonthlyOnThe,
  Weekly,
} from './interface';
import { End } from './reducer';
import RRule from 'rrule';

export const updateStartString = (startDate: string, startTime: string) =>
  actions.updateStart({
    startDate: startDate,
    startTime: startTime,
  });

export const updateEndString = (
  mode: string,
  endDate: string,
  endCount: number
) =>
  actions.updateEnd({
    mode: mode,
    endDate: endDate,
    endCount: endCount,
  });

export const updateRepeatHourly = (repeatHourly: Hourly) =>
  actions.updateRepeatHourly({
    repeatHourly: repeatHourly,
  });

export const updateRepeatDaily = (repeatDaily: Daily) =>
  actions.updateRepeatDaily({
    repeatDaily: repeatDaily,
  });

export const updateRepeatYearlyOn = (repeatYearlyOn: YearlyOn) =>
  actions.updateRepeatYearlyOn({
    repeatYearlyOn: repeatYearlyOn,
  });

export const updateRepeatYearlyOnThe = (repeatYearlyOnThe: YearlyOnThe) =>
  actions.updateRepeatYearlyOnThe({
    repeatYearlyOnThe: repeatYearlyOnThe,
  });

export const updateRepeatMonthlyOn = (repeatMonthlyOn: MonthlyOn) =>
  actions.updateRepeatMonthlyOn({
    repeatMonthlyOn: repeatMonthlyOn,
  });

export const updateRepeatMonthlyOnThe = (repeatMonthlyOnThe: MonthlyOnThe) =>
  actions.updateRepeatMonthlyOnThe({
    repeatMonthlyOnThe: repeatMonthlyOnThe,
  });

export const updateRepeatMonthlyCount = (repeatMonthlyCount: number) =>
  actions.updateRepeatMonthlyCount({
    repeatMonthlyCount: repeatMonthlyCount,
  });

export const updateRepeatWeeklyCount = (repeatWeeklyCount: number) =>
  actions.updateRepeatWeeklyCount({
    repeatWeeklyCount: repeatWeeklyCount,
  });

export const updateRepeatWeekly = (repeatWeekly: Weekly) =>
  actions.updateRepeatWeekly({
    repeatWeekly: repeatWeekly,
  });

export const updateMonthlyOn = (monthlyOn: boolean) =>
  actions.updateMonthlyOn({ monthlyOn: monthlyOn });

export const updateYearlyOn = (yearlyOn: boolean) =>
  actions.updateYearlyOn({ yearlyOn: yearlyOn });

export const convertToTextWithRRule = (rrule: string) => {
    const rule = RRule.fromString(rrule);
    const resultString = rule.toText();

    const result = resultString.charAt(0).toUpperCase() + resultString.slice(1) + ' starting at ' +
        rrule.substr(8, 4) + '-' + rrule.substr(12, 2) + '-' +
        rrule.substr(14, 2) + ' ' + rrule.substr(17, 2) + ':' +
        rrule.substr(19, 2);
    return result;
};

export const convertToTextWithTime = (start: any, repeat: any, end: End) => {
  let resultString = '';
  const rRuleFirstPart = new RRule({
    ...start,
    ...repeat,
    ...end,
  });
  resultString = rRuleFirstPart.toText();

  return resultString.charAt(0).toUpperCase() + resultString.slice(1);
};
