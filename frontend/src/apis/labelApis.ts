import { doFetch, doPost, doDelete, doPatch } from './api-helper';

export const fetchLabels = () => {
  return doFetch('/api/labels')
    .then(res => res)
    .catch(err => {
      throw Error(err.message);
    });
};

export const addLabel = (name: string) => {
    const postBody = JSON.stringify({
      name: name
    });
    return doPost('/api/labels', postBody)
      .then(res => res.json())
      .catch(err => {
        throw Error(err.message);
    });
};

export const deleteLabel = (labelId: number) => {
    return doDelete(`/api/labels/${labelId}`).catch(err => {
      throw Error(err.message);
    });
};

export const updateLabel = (labelId: number, name: string) => {
    const patchBody = JSON.stringify({
      name: name
    });

    return doPatch(`/api/labels/${labelId}`, patchBody)
      .then(res => res.json())
      .catch(err => {
        throw Error(err.message);
    });
};

export const fetchItemsByLabels = (labels: number[]) => {
    // e.g. /api/items?labels=1&labels=2&labels=3
    return doFetch('/api/items?'
    + labels.map(l => `labels=${l}`).join('&'))
    .then(res => res.json())
    .catch(err => {
      throw Error(err.message);
    });
}