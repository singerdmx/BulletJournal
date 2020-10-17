import {doFetch, doPost, doPut} from './api-helper';

export const fetchSystemUpdates = (targets = '', projectId = undefined, remindingTaskEtag = undefined) => {
    let endpoint = '/api/system/updates';
    if (targets && projectId) {
        endpoint += `?targets=${targets}&projectId=${projectId}`;
    } else if (targets) {
        endpoint += `?targets=${targets}}`;
    } else if (projectId) {
        endpoint += `?projectId=${projectId}`;
    }
    return doFetch(endpoint, remindingTaskEtag)
        .then(res => res.json())
        .catch(err => {
            throw Error(err.message);
        });
};

export const getPublicProjectItem = (itemId: string) => {
    return doFetch(`/api/public/items/${itemId}`)
        .then(res => res.json())
        .catch(err => {
            throw Error(err.message);
        });
};

export const contactSupport = (forumId: number, title: String, content: String) => {
    const postBody = JSON.stringify({
        forumId: forumId,
        title: title,
        content: content
    });
    return doPost('/api/contacts', postBody);
};

export const setSharedItemLabels = (itemId: string, labels: number[]) => {
    const putBody = JSON.stringify(labels);
    return doPut(`/api/sharedItems/${itemId}/setLabels`, putBody)
        .then(res => res.json())
        .catch((err) => {
            throw Error(err.message);
        });
};