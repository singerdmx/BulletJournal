import {doDelete, doFetch, doPost, doPut} from '../api-helper';

export const getChoices = () => {
    return doFetch('/api/public/choices')
        .then((res) => res.json())
        .catch((err) => {
            throw Error(err.message);
        });
}

export const getChoice = (choiceId: number) => {
    return doFetch(`/api/public/choices/${choiceId}`)
        .then((res) => res.json())
        .catch((err) => {
            throw Error(err.message);
        });
}

export const createChoice = (name: string, multiple: boolean) => {
    const postBody = JSON.stringify({
        name: name,
        multiple: multiple,
    });
    return doPost('/api/choices', postBody)
        .then(res => res.json())
        .catch(err => {
            throw Error(err.message);
        });
}

export const deleteChoice = (choiceId: number) => {
    return doDelete(`/api/choices/${choiceId}`)
        .then(res => res.json())
        .catch((err) => {
            throw Error(err.message);
        });
}

export const updateChoice = (choiceId: number, name: string, multiple: boolean, instructionIncluded: boolean) => {
    const putBody = JSON.stringify({
        name: name,
        multiple: multiple,
        instructionIncluded: instructionIncluded
    });
    return doPut(`/api/choices/${choiceId}`, putBody)
        .then(res => res.json())
        .catch(err => {
            throw Error(err.message);
        });
}