import { ProjectItem } from '../myBuJo/interface';
import {User} from "../group/interface";

export enum BankAccountType {
  CHECKING_ACCOUNT = 'CHECKING_ACCOUNT',
  SAVING_ACCOUNT = 'SAVING_ACCOUNT',
  CREDIT_CARD = 'CREDIT_CARD'
}

export interface BankAccount {
  id: number;
  name: string;
  owner: User;
  accountType: BankAccountType;
  netBalance: number;
  accountNumber?: string;
  description?: string;
}

export interface Transaction extends ProjectItem {
  amount: number;
  payer: User;
  date?: string;
  recurrenceRule?: string;
  time: string;
  timezone: string;
  location: string;
  transactionType: number;
  color?: string;
  bankAccount?: BankAccount;
}

export interface TransactionView extends Transaction {
  paymentTime?: number;
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
