import {doDelete, doFetch, doPost, doPut} from '../api-helper';

export const getChoices = () => {
    return doFetch('/api/public/choices')
        .then((res) => res.json())
        .catch((err) => {
            throw Error(err.message);
        });
}