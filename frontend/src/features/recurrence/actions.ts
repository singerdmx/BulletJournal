import { actions } from './reducer';
import {
  Hourly,
  Daily,
  YearlyOn,
  YearlyOnThe,
  MonthlyOn,
  MonthlyOnThe,
  Weekly
} from './interface';

export const updateStartString = (startDate: string) =>
  actions.updateStart({
    startDate: startDate
  });

export const updateEndString = (
  mode: string,
  endDate: string,
  endCount: number
) =>
  actions.updateEnd({
    mode: mode,
    endDate: endDate,
    endCount: endCount
  });

export const updateRepeatHourly = (repeatHourly: Hourly) =>
  actions.updateRepeatHourly({
    repeatHourly: repeatHourly
  });

export const updateRepeatDaily = (repeatDaily: Daily) =>
  actions.updateRepeatDaily({
    repeatDaily: repeatDaily
  });

export const updateRepeatYearlyOn = (repeatYearlyOn: YearlyOn) =>
  actions.updateRepeatYearlyOn({
    repeatYearlyOn: repeatYearlyOn
  });

export const updateRepeatYearlyOnThe = (repeatYearlyOnThe: YearlyOnThe) =>
  actions.updateRepeatYearlyOnThe({
    repeatYearlyOnThe: repeatYearlyOnThe
  });

export const updateRepeatMonthlyOn = (repeatMonthlyOn: MonthlyOn) =>
  actions.updateRepeatMonthlyOn({
    repeatMonthlyOn: repeatMonthlyOn
  });

export const updateRepeatMonthlyOnThe = (repeatMonthlyOnThe: MonthlyOnThe) =>
  actions.updateRepeatMonthlyOnThe({
    repeatMonthlyOnThe: repeatMonthlyOnThe
  });

export const updateRepeatMonthlyCount = (repeatMonthlyCount: number) =>
  actions.updateRepeatMonthlyCount({
    repeatMonthlyCount: repeatMonthlyCount
  });

export const updateRepeatWeeklyCount = (repeatWeeklyCount: number) =>
  actions.updateRepeatWeeklyCount({
    repeatWeeklyCount: repeatWeeklyCount
  });

export const updateRepeatWeekly = (repeatWeekly: Weekly) =>
  actions.updateRepeatWeekly({
    repeatWeekly: repeatWeekly
  });

export const updateMonthlyOn = (monthlyOn: boolean) =>
  actions.updateMonthlyOn({ monthlyOn: monthlyOn });

export const updateYearlyOn = (yearlyOn: boolean) =>
  actions.updateYearlyOn({ yearlyOn: yearlyOn });
