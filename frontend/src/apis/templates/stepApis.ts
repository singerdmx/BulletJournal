import {doDelete, doFetch, doPost, doPut} from '../api-helper';

export const getSteps = () => {
    return doFetch('/api/steps')
        .then((res) => res.json())
        .catch((err) => {
            throw Error(err.message);
        });
}

export const getStep = (stepId: number) => {
    return doFetch(`/api/public/steps/${stepId}`)
        .then((res) => res.json())
        .catch((err) => {
            throw Error(err.message);
        });
}

export const createStep = (
    name: string, nextStepId?: number) => {
    const postBody = JSON.stringify({
        name: name,
        nextStepId: nextStepId
    });
    return doPost('/api/steps', postBody)
        .then(res => res.json())
        .catch(err => {
            throw Error(err.message);
        });
}

export const putStep = (stepId: number, name?: string, nextStepId?: number) => {
    const putBody = JSON.stringify({
        name: name,
        nextStepId: nextStepId
    });
    return doPut(`/api/steps/${stepId}`, putBody)
        .then(res => res.json())
        .catch(err => {
            throw Error(err.message);
        });
}

export const deleteStep = (stepId: number) => {
    return doDelete(`/api/steps/${stepId}`)
        .then(res => res)
        .catch((err) => {
            throw Error(err.message);
        });
}

export const updateChoicesForStep = (stepId: number, choicesIds: number[]) => {
    const putBody = JSON.stringify(choicesIds);
    return doPut(`/api/steps/${stepId}/setChoices`, putBody)
        .then(res => res.json())
        .catch(
            (err) => {
                throw Error(err.message);
            }
        );
};

export const updateExcludedSelectionsForStep = (stepId: number, excludedSelectionIds: number[]) => {
    const putBody = JSON.stringify(excludedSelectionIds);
    return doPut(`/api/steps/${stepId}/setExcludedSelections`, putBody)
        .then(res => res.json())
        .catch(
            (err) => {
                throw Error(err.message);
            }
        );
};

export const cloneStep = (stepId: number) => {
    return doPost(`/api/steps/${stepId}/clone`)
        .then(res => res.json())
        .catch(err => {
            throw Error(err.message);
        });
}