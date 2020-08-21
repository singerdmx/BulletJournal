import {doFetch, doPost} from '../api-helper';

export const getCategories = () => {
    return doFetch('/api/categories')
        .then((res) => res.json())
        .catch((err) => {
            throw Error(err.message);
        });
}

export const createCategory = (name: string, description: string) => {
    const postBody = JSON.stringify({
        name: name,
        description: description
    });
    return doPost('/api/categories', postBody)
        .then(res => res.json())
        .catch(err => {
            throw Error(err.message);
        });
}