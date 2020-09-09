import {doFetch} from '../api-helper';

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