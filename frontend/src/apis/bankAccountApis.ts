import { doFetch, doPost, doDelete, doPatch } from './api-helper';

export const fetchBankAccounts = () => {
    return doFetch('/api/bankAccounts')
        .then(res => res)
        .catch(err => {
            throw Error(err.message);
        });
};