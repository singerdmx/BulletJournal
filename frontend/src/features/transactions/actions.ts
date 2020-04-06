import { actions } from './reducer';
import { History } from 'history';

export const updateTransactions = (
  projectId: number,
  timezone: string,
  frequencyType: string,
  ledgerSummaryType: string,
  startDate?: string,
  endDate?: string
) =>
  actions.TransactionsUpdate({
    projectId: projectId,
    timezone: timezone,
    frequencyType: frequencyType,
    ledgerSummaryType: ledgerSummaryType,
    startDate: startDate,
    endDate: endDate,
  });
export const createTransaction = (
  projectId: number,
  amount: number,
  name: string,
  payer: string,
  date: string,
  transactionType: number,
  timezone: string,
  time?: string
) =>
  actions.TransactionsCreate({
    projectId: projectId,
    amount: amount,
    name: name,
    payer: payer,
    date: date,
    transactionType: transactionType,
    timezone: timezone,
    time: time,
  });
export const getTransaction = (transactionId: number) =>
  actions.TransactionGet({ transactionId: transactionId });
export const deleteTransaction = (transactionId: number) =>
  actions.TransactionDelete({ transactionId: transactionId });
export const patchTransaction = (
  transactionId: number,
  amount: number,
  name: string,
  payer: string,
  date: string,
  time: string,
  transactionType: number,
  timezone: string
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
