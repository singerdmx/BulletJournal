import { doFetch, doPost, doDelete, doPut } from './api-helper';
import {BankAccountType} from "../features/transactions/interface";

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

export const createBankAccount = (name: string,
                               accountType: BankAccountType,
                               accountNumber?: string,
                               description?: string) => {
    const postBody = JSON.stringify({
        name: name,
        accountType: accountType,
        accountNumber: accountNumber,
        description: description
    });
    return doPost('/api/bankAccounts', postBody)
        .then(res => res.json())
        .catch(err => {
            throw Error(err.message);
        });
};

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

export const deleteBankAccount = (bankAccountId: number) => {
    return doDelete(`/api/bankAccounts/${bankAccountId}`)
        .then(res => res)
        .catch(err => {
            throw Error(err.message);
        });
};

export const updateBankAccount = (
        bankAccountId: number,
        name: string,
        accountType: BankAccountType,
        accountNumber?: string,
        description?: string
    ) => {
        const body = JSON.stringify({
            name: name,
            accountType: accountType,
            accountNumber: accountNumber,
            description: description
    });
    return doPut(`/api/bankAccounts/${bankAccountId}`, body)
        .then(res => res.json())
        .catch(err => {
            throw Error(err.message);
    });
};
