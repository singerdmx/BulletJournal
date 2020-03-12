import { doFetch, doPost, doDelete, doPatch, doPut } from './api-helper';

export const fetchTransactions = (projectId: number) => {
  return doFetch(`/api/projects/${projectId}/transactions`)
    .then(res => res)
    .catch(err => {
      throw Error(err.message);
    });
};

export const getTransactionById = (transactionId: number) => {
  return doFetch(`/api/transactions/${transactionId}`)
    .then(res => res.json())
    .catch(err => {
      throw Error(err.message);
    });
};

export const deleteTransactionById = (transactionId: number) => {
  return doDelete(`/api/transactions/${transactionId}`)
    .catch(err => {
      throw Error(err.message);
    });
};

export const createTransaction = (projectId: number, amount: number, name: string, payer: string,
  transactionType: number, date?: string, time?: string, timezone?: string) => {
  const postBody = JSON.stringify({
    amount: amount,
    name: name,
    payer: payer,
    transactionType: transactionType,
    date: date,
    time: time,
    timezone: timezone
  });
  return doPost(`/api/projects/${projectId}/transactions`, postBody)
    .then(res => res.json())
    .catch(err => {
      throw Error(err.message);
    });
};

export const updateTransaction = (
  transactionId: number,
  amount: number,
  name: string,
  payer: string,
  transactionType: number,
  date?: string,
  time?: string,
  timezone?: string
) => {
  const patchBody = JSON.stringify({
    amount: amount,
    name: name,
    payer: payer,
    transactionType: transactionType,
    date: date,
    time: time,
    timezone: timezone
  });
  return doPatch(`/api/transactions/${transactionId}`, patchBody)
    .then(res => res.json())
    .catch(err => {
      throw Error(err);
    });
};

export const setTransactionLabels = (transactionId: number, labels: number[]) => {
  const putBody = JSON.stringify(labels);
  return doPut(`/api/transactions/{transactionId}/setLabels`, putBody)
    .then(res => res.json())
    .catch(err => {
      throw Error(err.message);
    });
}