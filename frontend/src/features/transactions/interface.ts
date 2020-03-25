import { ProjectItem } from '../myBuJo/interface';

export interface Transaction extends ProjectItem {
  amount: number;
  payer: string;
  date: string;
  time: string;
  timezone: string;
  transactionType: number;
}

export enum FrequencyType {
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY'
}

export enum LedgerSummaryType {
  DEFAULT = 'DEFAULT',
  PAYER = 'PAYER',
  LABEL = 'LABEL',
  TIMELINE = 'TIMELINE'
}
