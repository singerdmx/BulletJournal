import { ProjectItem } from '../myBuJo/interface';
import {User} from "../group/interface";

export interface Transaction extends ProjectItem {
  amount: number;
  payer: User;
  date: string;
  time: string;
  timezone: string;
  transactionType: number;
}

export interface TransactionView extends Transaction {
  paymentTime: number;
}

export interface TransactionsSummary {
  balance: number;
  expense: number;
  expensePercentage: number;
  income: number;
  incomePercentage: number;
  name: string;
  metadata?: string;
  incomeCount: number;
  expenseCount: number;
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
}
