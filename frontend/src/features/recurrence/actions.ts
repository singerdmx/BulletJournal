import {actions} from './reducer';
import {bySetPosMap, byWeekDayMap, MonthlyOn, MonthlyOnThe, Weekly, YearlyOn, YearlyOnThe,} from './interface';
import RRule, {Frequency} from 'rrule';
import {Task} from "../tasks/interface";

export const updateFreq = (freq: Frequency) =>
  actions.updateFreq({ freq: freq });

export const updateStartString = (startDate: string, startTime: string) =>
  actions.updateStart({
    startDate: startDate,
    startTime: startTime,
  });

export const updateEndString = (
  endDate: string | null,
  endCount: number | null
) =>
  actions.updateEnd({
    endDate: endDate,
    endCount: endCount,
  });

export const updateRepeatHourly = (repeatHourly: number) =>
  actions.updateRepeatHourly({
    repeatHourly: repeatHourly,
  });

export const updateRepeatDaily = (repeatDaily: number) =>
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

export const updateRruleString = (task: Task) =>
  actions.updateRRuleString({ task: task });

export const getBySetPosWhich = (rule: RRule) => {
    let which = 'First';
    if (rule.options.bysetpos) {
        bySetPosMap.forEach((v: number, k: string) => {
            if (v === rule.options.bysetpos[0]) {
                which = k;
            }
        });
    }
    return which;
}

export const getByWeekDay = (rule: RRule) => {
    let day = 'Monday';
    if (rule.options.byweekday) {
        byWeekDayMap.forEach((v: number[], k: string) => {
            if (JSON.stringify(v) === JSON.stringify(rule.options.byweekday)) {
                day = k;
            }
        });
    }
    return day;
}

export const convertToTextWithRRule = (rrule: string) => {
    const rule = RRule.fromString(rrule);
    const resultString = rule.toText();
    let result =
        resultString.charAt(0).toUpperCase() +
        resultString.slice(1);

    if (rule.options.freq === Frequency.MONTHLY && rule.options.bysetpos) {
        const which = getBySetPosWhich(rule);
        const day = getByWeekDay(rule);
        result = result.substring(0, result.toLowerCase().indexOf('month') + 6) + 'on the ' + which.toLowerCase() + ' ' + day.toLowerCase();
    }

    const starting = ' starting at ' +
        rrule.substr(8, 4) +
        '-' +
        rrule.substr(12, 2) +
        '-' +
        rrule.substr(14, 2) +
        ' ' +
        rrule.substr(17, 2) +
        ':' +
        rrule.substr(19, 2);
    return result + starting;
};