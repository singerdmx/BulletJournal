import { actions } from './reducer';
import { Hourly, Daily, YearlyOn, YearlyOnThe } from './interface';

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
