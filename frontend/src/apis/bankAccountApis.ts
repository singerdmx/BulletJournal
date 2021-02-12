import {doFetch, doPost} from './api-helper';

export const fetchBankAccounts = () => {
    return doFetch('/api/bankAccounts')
        .then(res => res)
        .catch(err => {
            throw Error(err.message);
        });
}

export const fetchBankAccountTransactions = (
    bankAccountId: number,
    timezone: string,
    startDate: string,
    endDate: string,
) => {
    return doFetch(`/api/bankAccounts/${bankAccountId}/transactions?timezone=${encodeURIComponent(
        timezone
    )}&startDate=${startDate}&endDate=${endDate}`)
        .then(res => res.json())
        .catch(err => {
            throw Error(err.message);
        });
}

export const setAccountBalance = (bankAccountId: number, balance: number, description: string) => {
    const postBody = JSON.stringify({
        balance: balance,
        description: description
    });
    return doPost(`/api/bankAccounts/${bankAccountId}/setBalance`, postBody)
        .catch((err) => {
            throw Error(err.message);
        });
}