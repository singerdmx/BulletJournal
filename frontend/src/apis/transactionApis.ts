import { doFetch, doPost, doDelete, doPatch, doPut } from './api-helper';

export const fetchTransactions = (
  projectId: number,
  timezone: string,
  ledgerSummaryType: string,
  frequencyType?: string,
  startDate?: string,
  endDate?: string,
  payer?: string,
  labelsToKeep?: number[],
  labelsToRemove?: number[],
) => {
  // e.g. /api/projects/105/transactions?frequencyType=MONTHLY&timezone=America%2FLos_Angeles
  let url = `/api/projects/${projectId}/transactions?timezone=${encodeURIComponent(
    timezone
  )}&ledgerSummaryType=${ledgerSummaryType}`;

  if (frequencyType) {
    url += `&frequencyType=${frequencyType}`;
  }
  if (startDate && endDate) {
    url += `&startDate=${startDate}&endDate=${endDate}`;
  }
  if (payer) {
    url += `&payer=${payer}`;
  }
  if (labelsToKeep && labelsToKeep.length > 0) {
    url += '&' + labelsToKeep.map(l => `labelsToKeep=${l}`).join('&');
  }
  if (labelsToRemove && labelsToRemove.length > 0) {
    url += '&' + labelsToRemove.map(l => `labelsToRemove=${l}`).join('&');
  }
  return doFetch(url)
    .then((res) => res)
    .catch((err) => {
      throw Error(err.message);
    });
};

export const getTransactionById = (transactionId: number) => {
  return doFetch(`/api/transactions/${transactionId}`)
    .then((res) => res.json())
    .catch((err) => {
      throw Error(err.message);
    });
};

export const deleteTransactionById = (transactionId: number) => {
  return doDelete(`/api/transactions/${transactionId}`).catch((err) => {
    throw Error(err.message);
  });
};

export const deleteTransactions = (
  projectId: number,
  transactionsId: number[]
) => {
  let url = `/api/projects/${projectId}/transactions`;
  if (transactionsId && transactionsId.length > 0) {
    url += `?transactions=${transactionsId[0]}`;

    for (var i = 1; i < transactionsId.length; i++) {
      url += `&transactions=${transactionsId[i]}`;
    }
  }
  return doDelete(url).catch((err) => {
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
  labels?: number[],
  time?: string
) => {
  const postBody = JSON.stringify({
    amount: amount,
    name: name,
    payer: payer,
    transactionType: transactionType,
    date: date,
    time: time,
    labels: labels,
    timezone: timezone,
  });
  return doPost(`/api/projects/${projectId}/transactions`, postBody)
    .then((res) => res.json())
    .catch((err) => {
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
  timezone?: string,
  labels?: number[]
) => {
  const patchBody = JSON.stringify({
    amount: amount,
    name: name,
    payer: payer,
    transactionType: transactionType,
    date: date,
    time: time,
    timezone: timezone,
    labels: labels,
  });
  return doPatch(`/api/transactions/${transactionId}`, patchBody)
    .then((res) => res.json())
    .catch((err) => {
      throw Error(err);
    });
};

export const setTransactionLabels = (
  transactionId: number,
  labels: number[]
) => {
  const putBody = JSON.stringify(labels);
  return doPut(`/api/transactions/${transactionId}/setLabels`, putBody)
    .then((res) => res.json())
    .catch((err) => {
      throw Error(err.message);
    });
};

export const moveToTargetProject = (
  transactionId: number,
  targetProject: number
) => {
  const postBody = JSON.stringify({
    targetProject: targetProject,
  });
  return doPost(`/api/transactions/${transactionId}/move`, postBody)
    .then((res) => res)
    .catch((err) => {
      throw Error(err);
    });
};

export const shareTransactionWithOther = (
  transactionId: number,
  targetUser: string,
  targetGroup: number,
  generateLink: boolean
) => {
  const postBody = JSON.stringify({
    targetUser: targetUser,
    targetGroup: targetGroup,
    generateLink: generateLink,
  });
  return doPost(`/api/transactions/${transactionId}/share`, postBody)
    .then((res) => res)
    .catch((err) => {
      throw Error(err);
    });
};

export const getContents = (transactionId: number) => {
  return doFetch(`/api/transactions/${transactionId}/contents`)
    .then((res) => res.json())
    .catch((err) => {
      throw Error(err.message);
    });
};

export const addContent = (transactionId: number, text: string) => {
  const postBody = JSON.stringify({
    text: text,
  });

  return doPost(`/api/transactions/${transactionId}/addContent`, postBody)
    .then((res) => res.json())
    .catch((err) => {
      throw Error(err);
    });
};

export const deleteContent = (transactionId: number, contentId: number) => {
  return doDelete(`/api/transactions/${transactionId}/contents/${contentId}`)
    .then((res) => res)
    .catch((err) => {
      throw Error(err.message);
    });
};

export const updateContent = (
  transactionId: number,
  contentId: number,
  text: string,
  etag: string,
  diff: string,
) => {
  const patchBody = JSON.stringify({
    text: text,
    diff: diff,
  });
  return doPatch(
    `/api/transactions/${transactionId}/contents/${contentId}`,
    patchBody,
    etag
  )
    .then((res) => res.json())
    .catch((err) => {
      throw Error(err);
    });
};

export const getContentRevision = (
  transactionId: number,
  contentId: number,
  revisionId: number
) => {
  return doFetch(
    `/api/transactions/${transactionId}/contents/${contentId}/revisions/${revisionId}`
  )
    .then((res) => res.json())
    .catch((err) => {
      throw Error(err.message);
    });
};

export const patchRevisionContents = (
    transactionId: number,
    contentId: number,
    revisionContents: string[],
    etag: string,
) => {
  const patchBody = JSON.stringify({
    revisionContents: revisionContents,
  });
  return doPost(`/api/transactions/${transactionId}/contents/${contentId}/patchRevisionContents`, patchBody, etag)
      .then((res) => res.json())
      .catch((err) => {
        throw Error(err);
      });
};