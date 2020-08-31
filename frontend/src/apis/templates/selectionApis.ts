import {doDelete, doPost, doPut} from '../api-helper';

export const createSelection = (choiceId: number, text: string) => {
    const postBody = JSON.stringify({
        text: text,
    });
    return doPost(`/api/choices/${choiceId}/selections`, postBody)
        .then(res => res.json())
        .catch(err => {
            throw Error(err.message);
        });
}

export const deleteSelection = (selectionId: number) => {
    return doDelete(`/api/selections/${selectionId}`)
        .catch((err) => {
            throw Error(err.message);
        });
}

export const updateSelection = (selectionId: number, text: string) => {
    const putBody = JSON.stringify({
        text: text,
    });
    return doPut(`/api/selections/${selectionId}`, putBody)
        .then(res => res.json())
        .catch(err => {
            throw Error(err.message);
        });
}