import {doDelete, doFetch, doPatch, doPost, doPut} from './api-helper';
import {Content} from '../features/myBuJo/interface';
import {Quill} from 'react-quill';
import {createHTML} from '../components/content/content-item.component';
import {Transaction} from "../features/transactions/interface";

export const fetchRecurringTransactions = (projectId: number) => {
  return doFetch(`/api/projects/${projectId}/recurringTransactions`)
      .then((res) => res.json())
      .catch((err) => {
        throw Error(err.message);
      });
}

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

export const deleteTransactionById = (transactionId: number, dateTime?: string) => {
  let url = `/api/transactions/${transactionId}`;
  if (dateTime) {
    url += `?dateTime=${dateTime}`;
  }
  return doDelete(url).catch((err) => {
    throw Error(err.message);
  });
};

export const deleteTransactions = (
    projectId: number,
    transactions: Transaction[]
) => {
  const getTransactionString = (t: Transaction) => {
    if (!t.recurrenceRule) {
      return t.id;
    }

    // %23 => #
    // %20 => space
    return t.id + '%23' + t.date + '%20' + t.time;
  }

  console.log('transactions', transactions);
  let url = `/api/projects/${projectId}/transactions`;
  url += `?transactions=${getTransactionString(transactions[0])}`;

  for (let i = 1; i < transactions.length; i++) {
    url += `&transactions=${getTransactionString(transactions[i])}`;
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
  timezone: string,
  location: string,
  date?: string,
  time?: string,
  recurrenceRule?: string,
  labels?: number[],
  bankAccountId?: number) => {
  const postBody = JSON.stringify({
    amount: amount,
    name: name,
    payer: payer,
    transactionType: transactionType,
    date: date,
    time: time,
    labels: labels,
    timezone: timezone,
    location: location,
    recurrenceRule: recurrenceRule,
    bankAccountId: bankAccountId
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
  location?: string,
  labels?: number[],
  recurrenceRule?: string,
  bankAccountId?: number
) => {
  const patchBody = JSON.stringify({
    amount: amount,
    name: name,
    payer: payer,
    transactionType: transactionType,
    date: date,
    time: time,
    timezone: timezone,
    location: location,
    labels: labels,
    recurrenceRule: recurrenceRule,
    bankAccountId: bankAccountId ? bankAccountId : -1 // because mobile does not pass bankAccountId
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

export const putTransactionColor = (transactionId: number, color: string | undefined) => {
  return doPut(`/api/transactions/${transactionId}/setColor`, color)
    .then((res) => res.json())
    .catch((err) => {
      throw Error(err.message);
    });
};

export const putTransactionBankAccount = (transactionId: number, bankAccount: number | undefined) => {
  return doPut(`/api/transactions/${transactionId}/setBankAccount`,
      bankAccount ? bankAccount.toString() : undefined)
      .then((res) => res.json())
      .catch((err) => {
        throw Error(err.message);
      });
};

export const shareTransactionByEmail = (
  transactionId: number,
  contents: Content[],
  emails: string[],
  targetUser?: string,
  targetGroup?: number,
) => {
  const Delta = Quill.import('delta');
  let contentsHTML : Content[] = [];
  contents.forEach((content) => {
    let contentHTML = {...content};
    contentHTML['text'] = createHTML(new Delta(JSON.parse(content.text)['delta']));
    contentsHTML.push(contentHTML);
  })
  
  const postBody = JSON.stringify({
    targetUser: targetUser,
    targetGroup: targetGroup,
    emails: emails,
    contents: contentsHTML,
  });
  return doPost(`/api/transactions/${transactionId}/exportEmail`, postBody)
    .then((res) => (res))
    .catch((err) => {
      throw Error(err);
    });
};
