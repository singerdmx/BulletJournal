export interface YearlyOn {
    month: string;
    day: number;
}

export interface YearlyOnThe {
    month: string;
    day: string;
    which: string;
}

export interface MonthlyOn {
    day: number;
}

export interface MonthlyOnThe {
    day: string;
    which: string;
}

export type Weekly = {
    mon: boolean;
    tue: boolean;
    wed: boolean;
    thu: boolean;
    fri: boolean;
    sat: boolean;
    sun: boolean;
}

export const bySetPosMap = new Map([
    ['First', 1],
    ['Second', 2],
    ['Third', 3],
    ['Fourth', 4],
    ['Last', -1],
]);

export const byWeekDayMap = new Map([
  ['Monday', [0]],
  ['Tuesday', [1]],
  ['Wednesday', [2]],
  ['Thursday', [3]],
  ['Friday', [4]],
  ['Saturday', [5]],
  ['Sunday', [6]],
  ['Day', [0, 1, 2, 3, 4, 5, 6]],
  ['Weekday', [0, 1, 2, 3, 4]],
  ['Weekend day', [5, 6]],
]);
