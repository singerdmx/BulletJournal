import { doFetch, doPost, doDelete, doPatch, doPut } from './api-helper';

export const fetchTransactions = (
  projectId: number,
  timezone: string,
  frequencyType: string,
  ledgerSummaryType: string,
  startDate?: string,
  endDate?: string
) => {
  // e.g. /api/projects/105/transactions?frequencyType=MONTHLY&timezone=America%2FLos_Angeles
  let url = `/api/projects/${projectId}/transactions?timezone=${encodeURIComponent(
    timezone
  )}&frequencyType=${frequencyType}&ledgerSummaryType=${ledgerSummaryType}`;
  if (startDate && endDate) {
    url += `&startDate=${startDate}&endDate=${endDate}`;
  }
  return doFetch(url)
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
  return doDelete(`/api/transactions/${transactionId}`).catch(err => {
    throw Error(err.message);
  });
};

export const createTransaction = (
  projectId: number,
  amount: number,
  name: string,
  payer: string,
  transactionType: number,
  date: string,
  timezone: string,
  time?: string
) => {
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

export const setTransactionLabels = (
  transactionId: number,
  labels: number[]
) => {
  const putBody = JSON.stringify(labels);
  return doPut(`/api/transactions/{transactionId}/setLabels`, putBody)
    .then(res => res.json())
    .catch(err => {
      throw Error(err.message);
    });
};

export const moveToTargetProject = (
  transactionId: number,
  targetProject: number
) => {
  const postBody = JSON.stringify({
    targetProject: targetProject
  });
  return doPost(`/api/transactions/${transactionId}/move`, postBody)
    .then(res => res)
    .catch(err => {
      throw Error(err);
    });
};
