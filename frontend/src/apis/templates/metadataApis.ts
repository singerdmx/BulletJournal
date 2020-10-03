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
    return doPut(`/api/choiceMetadata/${keyword}`, putBody)
        .then((res) => res.json())
        .catch((err) => {
            throw Error(err.message);
        });
}

export const deleteChoiceMetadata = (keywords: string[]) => {
    // e.g. /api/choiceMetadata?keywords=11&keywords=12
    return doDelete('/api/choiceMetadata?' + keywords.map(k => `keywords=${k}`).join('&'))
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

export const deleteSelectionMetadata = (keywords: string[]) => {
    // e.g. /api/selectionMetadata?keywords=11&keywords=12
    return doDelete('/api/selectionMetadata?' + keywords.map(k => `keywords=${k}`).join('&'))
        .then(res => res.json())
        .catch((err) => {
            throw Error(err.message);
        });
}

export const fetchStepMetadata = () => {
    return doFetch('/api/stepMetadata')
        .then((res) => res.json())
        .catch((err) => {
            throw Error(err.message);
        });
}

export const putStepMetadata = (keyword: string, stepId: number) => {
    const putBody = JSON.stringify({
        stepId: stepId,
    });
    return doPut(`/api/stepMetadata/${keyword}`, putBody)
        .then((res) => res.json())
        .catch((err) => {
            throw Error(err.message);
        });
}

export const deleteStepMetadata = (keywords: string[]) => {
    // e.g. /api/stepMetadata?keywords=11&keywords=12
    return doDelete('/api/stepMetadata?' + keywords.map(k => `keywords=${k}`).join('&'))
        .then(res => res.json())
        .catch((err) => {
            throw Error(err.message);
        });
}