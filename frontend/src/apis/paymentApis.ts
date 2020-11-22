import {doPost} from './api-helper';

export const paymentIntentReceive = (amount: number) => {
    const postBody = JSON.stringify({
        amount: amount * 100,
        currency: 'usd'
    });
    return doPost("/api/paymentIntents", postBody);
};

export const paymentIntentConfirm = (payload: any) => {
    return doPost(`/api/paymentIntents/${payload.paymentIntent.id}`);
};