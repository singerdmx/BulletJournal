import {doDelete, doFetch, doPatch, doPost} from './api-helper';

export const fetchLabels = (projectId: number | undefined) => {
    let endpoint = '/api/labels';
    if (projectId) {
        endpoint += `?projectId=${projectId}`;
    }
    return doFetch(endpoint)
        .then(res => res)
        .catch(err => {
            throw Error(err.message);
        });
};

export const fetchProjectLabels = (projectId: number) => {
    return doFetch(`/api/projects/${projectId}/labels`)
        .then(res => res.json())
        .catch(err => {
            throw Error(err.message);
        });
};

export const addLabel = (value: string, icon: string) => {
    const postBody = JSON.stringify({
      value: value,
      icon: icon
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

export const updateLabel = (labelId: number, value?: string, icon?: string) => {
    const patchBody = JSON.stringify({
      value: value,
      icon: icon
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
};