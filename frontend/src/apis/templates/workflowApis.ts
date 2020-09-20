import {doDelete, doFetch, doPost, doPut} from '../api-helper';

export const getNext = (stepId: number, selections: number[], prevSelections: number[], first?: boolean) => {
    let url = `/api/public/steps/${stepId}/next?`;
    url += selections.map(s => `selections=${s}`).join('&');
    if (prevSelections.length > 0) {
        url += '&' + prevSelections.map(s => `prevSelections=${s}`).join('&');
    }
    if (first) {
        url += '&first=true';
    }
    return doFetch(url)
        .then((res) => res.json())
        .catch((err) => {
            throw Error(err.message);
        });
}

export const getSampleTasks = (scrollId: string) => {
    return doFetch('/api/public/sampleTasks')
        .then((res) => res.json())
        .catch((err) => {
            throw Error(err.message);
        });
}

export const getSampleTasksByFilter = (filter: string) => {
    return doFetch(`/api/sampleTasks?filter=${filter}`)
        .then((res) => res.json())
        .catch((err) => {
            throw Error(err.message);
        });
}

export const createSampleTask = (name: string, uid: string, content: string, metadata: string) => {
    const postBody = JSON.stringify({
        name: name,
        uid: uid,
        content: content,
        metadata: metadata
    });
    return doPost('/api/sampleTasks', postBody)
        .then(res => res.json())
        .catch(err => {
            throw Error(err.message);
        });
}

export const fetchSampleTask = (sampleTaskId: number) => {
    return doFetch(`/api/sampleTasks/${sampleTaskId}`)
        .then((res) => res.json())
        .catch((err) => {
            throw Error(err.message);
        });
}

export const deleteSampleTask = (sampleTaskId: number) => {
    return doDelete(`/api/sampleTasks/${sampleTaskId}`)
        .then(res => res)
        .catch((err) => {
            throw Error(err.message);
        });
}

export const putSampleTask = (sampleTaskId: number, name: string, uid: string, content: string, metadata: string) => {
    const putBody = JSON.stringify({
        name: name,
        uid: uid,
        content: content,
        metadata: metadata
    });
    return doPut(`/api/sampleTasks/${sampleTaskId}`, putBody)
        .then(res => res.json())
        .catch(err => {
            throw Error(err.message);
        });
}