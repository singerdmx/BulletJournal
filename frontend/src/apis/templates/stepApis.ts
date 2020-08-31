import {doDelete, doFetch, doPost, doPut} from '../api-helper';

export const getSteps = () => {
    return doFetch('/api/steps')
        .then((res) => res.json())
        .catch((err) => {
            throw Error(err.message);
        });
}