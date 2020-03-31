import { doFetch, doPost, doDelete, doPatch } from './api-helper';

export const fetchLabels = () => {
  return doFetch('http://localhost:8081/api/labels')
    .then(res => res)
    .catch(err => {
      throw Error(err.message);
    });
};

export const addLabel = (value: string, icon: string) => {
    const postBody = JSON.stringify({
      value: value,
      icon: icon
    });
    return doPost('http://localhost:8081/api/labels', postBody)
      .then(res => res.json())
      .catch(err => {
        throw Error(err.message);
    });
};

export const deleteLabel = (labelId: number) => {
    return doDelete(`http://localhost:8081/api/labels/${labelId}`).catch(err => {
      throw Error(err.message);
    });
};

export const updateLabel = (labelId: number, value?: string, icon?: string) => {
    const patchBody = JSON.stringify({
      value: value,
      icon: icon
    });

    return doPatch(`http://localhost:8081/api/labels/${labelId}`, patchBody)
      .then(res => res.json())
      .catch(err => {
        throw Error(err.message);
    });
};

export const fetchItemsByLabels = (labels: number[]) => {
    // e.g. /api/items?labels=1&labels=2&labels=3
    return doFetch('http://localhost:8081/api/items?'
    + labels.map(l => `labels=${l}`).join('&'))
    .then(res => res.json())
    .catch(err => {
      throw Error(err.message);
    });
}