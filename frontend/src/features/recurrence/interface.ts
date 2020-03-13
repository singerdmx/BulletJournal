export interface Hourly {
  interval: number;
}

export interface Daily {
  interval: number;
}

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

export interface Weekly {
  mon: boolean;
  tue: boolean;
  wed: boolean;
  thu: boolean;
  fri: boolean;
  sat: boolean;
  sun: boolean;
}
