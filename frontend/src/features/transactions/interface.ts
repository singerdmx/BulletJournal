import { ProjectItem } from '../myBuJo/interface';

export interface Transaction extends ProjectItem {
  amount: number;
  owner: string;
  payer: string;
  date: string;
  payerAvatar?: string;
  time: string;
  timezone: string;
  transactionType: number;
}

export interface TransactionsSummary {
  balance: number;
  expense: number;
  expensePercentage: number;
  income: number;
  incomePercentage: number;
  name: string;
  metadata?: string;
}

export interface LedgerSummary {
  balance: number;
  expense: number;
  income: number;
  startDate: string;
  endDate: string;
  transactions: Transaction[];
  transactionsSummaries: TransactionsSummary[];
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
