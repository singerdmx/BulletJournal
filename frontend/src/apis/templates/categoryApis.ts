import {doFetch} from '../api-helper';

export const getCategories = () => {
    return doFetch('/api/categories')
        .then((res) => res.json())
        .catch((err) => {
            throw Error(err.message);
        });
}