import { actions } from './reducer';
import { History } from 'history';
import {BankAccount, FrequencyType, LedgerSummaryType, Transaction} from './interface';
import {ProjectItemUIType} from "../project/constants";
import { Content } from '../myBuJo/interface';

export const updateTransactions = (
  projectId: number,
  timezone: string,
  ledgerSummaryType: string,
  frequencyType?: string,
  startDate?: string,
  endDate?: string,
  labelsToKeep?: number[],
  labelsToRemove?: number[],
) =>
  actions.TransactionsUpdate({
    projectId: projectId,
    timezone: timezone,
    frequencyType: frequencyType,
    ledgerSummaryType: ledgerSummaryType,
    startDate: startDate,
    endDate: endDate,
    labelsToKeep: labelsToKeep,
    labelsToRemove: labelsToRemove
  });
export const updateRecurringTransactions = (projectId: number) =>
    actions.RecurringTransactionsUpdate({projectId: projectId});
export const createTransaction = (
  projectId: number,
  amount: number,
  name: string,
  payer: string,
  transactionType: number,
  timezone: string,
  location: string,
  labels: number[],
  date?: string,
  time?: string,
  recurrenceRule?: string,
  bankAccountId?: number,
  onSuccess?: Function
) =>
  actions.TransactionsCreate({
    projectId: projectId,
    amount: amount,
    name: name,
    payer: payer,
    date: date,
    transactionType: transactionType,
    timezone: timezone,
    location: location,
    labels: labels,
    time: time,
    recurrenceRule: recurrenceRule,
    bankAccountId: bankAccountId,
    onSuccess: onSuccess
  });
export const getTransaction = (transactionId: number) =>
  actions.TransactionGet({ transactionId: transactionId });
export const deleteTransaction = (transactionId: number, onSuccess?: Function, type?: ProjectItemUIType, dateTime?: string) =>
  actions.TransactionDelete({ transactionId: transactionId, type: type, dateTime: dateTime, onSuccess: onSuccess });
export const deleteTransactions = (
  projectId: number,
  transactions: Transaction[],
  type: ProjectItemUIType
) =>
  actions.TransactionsDelete({
    projectId: projectId,
    transactions: transactions,
    type: type
  });
export const patchTransaction = (
  transactionId: number,
  amount: number,
  name: string,
  payer: string,
  transactionType: number,
  timezone: string,
  location: string,
  date?: string,
  time?: string,
  recurrenceRule?: string,
  labels?: number[],
  bankAccountId?: number
) =>
  actions.TransactionPatch({
    transactionId: transactionId,
    amount: amount,
    name: name,
    payer: payer,
    date: date,
    time: time,
    transactionType: transactionType,
    timezone: timezone,
    location: location,
    labels: labels,
    recurrenceRule: recurrenceRule,
    bankAccountId: bankAccountId
  });
export const setTransactionLabels = (transactionId: number, labels: number[]) =>
  actions.TransactionSetLabels({
    transactionId: transactionId,
    labels: labels,
  });

export const updateTransactionVisible = (visible: boolean) =>
  actions.UpdateAddTransactionVisible({ visible: visible });

export const shareTransaction = (
  transactionId: number,
  targetUser: string,
  targetGroup: number,
  generateLink: boolean
) =>
  actions.TransactionShare({
    transactionId: transactionId,
    targetUser: targetUser,
    targetGroup: targetGroup,
    generateLink: generateLink,
  });

export const moveTransaction = (
  transactionId: number,
  targetProject: number,
  history: History
) =>
  actions.TransactionMove({
    transactionId: transactionId,
    targetProject: targetProject,
    history: history,
  });

export const updateTransactionContents = (transactionId: number, updateDisplayMore?: boolean) =>
  actions.TransactionContentsUpdate({ transactionId: transactionId, updateDisplayMore: updateDisplayMore });
export const updateTransactionContentRevision = (
  transactionId: number,
  contentId: number,
  revisionId: number
) =>
  actions.TransactionContentRevisionUpdate({
    transactionId: transactionId,
    contentId: contentId,
    revisionId: revisionId,
  });

export const createContent = (transactionId: number, text: string) =>
  actions.TransactionContentCreate({
    transactionId: transactionId,
    text: text,
  });

export const deleteContent = (transactionId: number, contentId: number) =>
  actions.TransactionContentDelete({
    transactionId: transactionId,
    contentId: contentId,
  });
export const patchContent = (
  transactionId: number,
  contentId: number,
  text: string,
  diff: string,
  mdiff?: string
) =>
  actions.TransactionContentPatch({
    transactionId: transactionId,
    contentId: contentId,
    text: text,
    diff: diff,
    mdiff: mdiff
  });

export const updateTransactionForm = (
  startDate?: string,
  endDate?: string,
  frequencyType?: FrequencyType,
  ledgerSummaryType?: LedgerSummaryType,
  timezone?: string
) =>
  actions.TransactionFormUpdate({
    startDate,
    endDate,
    frequencyType,
    ledgerSummaryType,
    timezone,
  });

export const getTransactionsByPayer = (
  projectId: number,
  timezone: string,
  ledgerSummaryType: string,
  frequencyType?: string,
  startDate?: string,
  endDate?: string,
  payer?: string
) =>
  actions.getTransactionsByPayer({
    projectId: projectId,
    timezone: timezone,
    ledgerSummaryType: ledgerSummaryType,
    frequencyType: frequencyType,
    startDate: startDate,
    endDate: endDate,
    payer: payer,
  });

export const transactionReceived = (transaction: Transaction | undefined) =>
    actions.transactionReceived({transaction: transaction});

export const updateTransactionColorSettingShown = (visible: boolean) =>
    actions.updateTransactionColorSettingShown({TransactionColorSettingShown: visible});

export const updateTransactionColor = (
  transactionId: number,
  color: string | undefined
) =>
  actions.updateTransactionColor({ 
    transactionId: transactionId,
    color: color,
  });

export const updateTransactionBankAccount = (
    transactionId: number,
    bankAccount: number | undefined
) =>
    actions.updateTransactionBankAccount({
        transactionId: transactionId,
        bankAccount: bankAccount,
    });

export const shareTransactionByEmail = (
  transactionId: number,
  contents: Content[],
  emails: string[],
  targetUser?: string,
  targetGroup?: number,
) =>
  actions.TransactionShareByEmail({
    transactionId: transactionId,
    contents: contents,
    emails: emails,
    targetUser: targetUser,
    targetGroup: targetGroup,
  });

export const changeAccountBalance = (bankAccount: BankAccount, balance: number, description: string, onSuccess: Function) =>
    actions.ChangeBankAccountBalance({bankAccount: bankAccount, balance: balance, description: description, onSuccess: onSuccess});

export const getBankAccountTransactions = (bankAccountId: number, startDate: string, endDate: string) =>
    actions.GetBankAccountTransactions({bankAccountId: bankAccountId, startDate: startDate, endDate: endDate});
