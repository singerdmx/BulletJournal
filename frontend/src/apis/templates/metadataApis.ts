import {doDelete, doFetch, doPut} from '../api-helper';

export const fetchChoiceMetadata = () => {
    return doFetch('/api/choiceMetadata')
        .then((res) => res.json())
        .catch((err) => {
            throw Error(err.message);
        });
}

export const putChoiceMetadata = (keyword: string, choiceId: number) => {
    const putBody = JSON.stringify({
        choiceId: choiceId,
    });
    return doPut(`/api/choicesMetadata/${keyword}`, putBody)
        .then((res) => res.json())
        .catch((err) => {
            throw Error(err.message);
        });
}

export const deleteChoiceMetadata = (keyword: string) => {
    return doDelete(`/api/choicesMetadata/${keyword}`)
        .then(res => res.json())
        .catch((err) => {
            throw Error(err.message);
        });
}

export const fetchSelectionMetadata = () => {
    return doFetch('/api/selectionMetadata')
        .then((res) => res.json())
        .catch((err) => {
            throw Error(err.message);
        });
}

export const putSelectionMetadata = (keyword: string, selectionId: number) => {
    const putBody = JSON.stringify({
        selectionId: selectionId,
    });
    return doPut(`/api/selectionMetadata/${keyword}`, putBody)
        .then((res) => res.json())
        .catch((err) => {
            throw Error(err.message);
        });
}