import {doFetch, doPost} from '../api-helper';

export const getNext = (stepId: number, selections: number[], first?: boolean) => {
    let url = `/api/public/steps/${stepId}/next?`;
    url += selections.map(s => `selections=${s}`).join('&');
    if (first) {
        url += '&first=true';
    }
    return doFetch(url)
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

export const createSampleTask = (name: string, content: string, metadata: string) => {
    const postBody = JSON.stringify({
        name: name,
        content: content,
        metadata: metadata
    });
    return doPost('/api/sampleTasks', postBody)
        .then(res => res.json())
        .catch(err => {
            throw Error(err.message);
        });
}