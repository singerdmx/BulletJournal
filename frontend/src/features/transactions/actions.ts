import { actions } from './reducer';
export const updateTransactions = (projectId: number) =>
  actions.TransactionsUpdate({ projectId: projectId });
export const createTransaction = (
  projectId: number,
  amount: number,
  name: string,
  payer: string,
  date: string,
  transactionType: number,
  timezone: string,
  time?: string,
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
export const deleteTransaction = (transactionId: number) =>
  actions.TransactionDelete({ transactionId: transactionId });
export const patchTransaction = (
  transactionId: number,
  amount: number,
  name: string,
  payer: string,
  date: string,
  time: string,
  transactionType: number
) =>
  actions.TransactionPatch({
    transactionId: transactionId,
    amount: amount,
    name: name,
    payer: payer,
    date: date,
    time: time,
    transactionType: transactionType
  });
export const setTransactionLabels = (transactionId: number, labels: number[]) =>
  actions.TransactionSetLabels({
    transactionId: transactionId,
    labels: labels
  });
