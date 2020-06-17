import {doFetch} from './api-helper';

export const fetchSearchResults = (term: string, pageNo: number, pageSize: number, scrollId?: string) => {
    let endpoint = `/api/query?term=${term}&pageNo=${pageNo}&pageSize=${pageSize}`;

    if (scrollId) {
        endpoint += `&scrollId=${scrollId}`;
    }

    return doFetch(endpoint)
        .then(res => res.json())
        .catch(err => {
            throw Error(err.message);
        });
};