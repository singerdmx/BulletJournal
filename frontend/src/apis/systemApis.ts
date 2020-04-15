import {doFetch} from './api-helper';

export const fetchSystemUpdates = (targets = '', projectId = undefined) => {
    let endpoint = '/api/system/updates';
    if (targets && projectId) {
        endpoint += `?targets=${targets}&projectId=${projectId}`;
    } else if (targets) {
        endpoint += `?targets=${targets}}`;
    } else if (projectId) {
        endpoint += `?projectId=${projectId}`;
    }
    return doFetch(endpoint)
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
