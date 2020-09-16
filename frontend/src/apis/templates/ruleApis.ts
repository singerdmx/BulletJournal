import {doDelete, doFetch, doPost, doPut} from '../api-helper';

export const getRule = (ruleId: number, ruleType: string) => {
    // ruleType is CATEGORY_RULE or STEP_RULE
    return doFetch(`/api/rules/${ruleId}?ruleType=${ruleType}`)
        .then((res) => res.json())
        .catch((err) => {
            throw Error(err.message);
        });
}

export const createRule = (
    name: string, connectedStepId: number, ruleExpression: string, priority: number, stepId?: number, categoryId?: number) => {
    const postBody = JSON.stringify({
        name: name,
        connectedStepId: connectedStepId,
        ruleExpression: ruleExpression,
        priority: priority,
        stepId: stepId,
        categoryId: categoryId
    });
    return doPost('/api/rules', postBody)
        .then(res => res.json())
        .catch(err => {
            throw Error(err.message);
        });
}

export const updateRule = (ruleId: number, name?: string,
                           ruleExpression?: string, priority?: number, stepId?: number, categoryId?: number) => {
    const putBody = JSON.stringify({
        name: name,
        ruleExpression: ruleExpression,
        priority: priority,
        stepId: stepId,
        categoryId: categoryId
    });
    return doPut(`/api/rules/${ruleId}`, putBody)
        .then(res => res.json())
        .catch(err => {
            throw Error(err.message);
        });
}

export const deleteRule = (ruleId: number, ruleType: string) => {
    // ruleType is CATEGORY_RULE or STEP_RULE
    return doDelete(`/api/rules/${ruleId}?ruleType=${ruleType}`)
        .then(res => res)
        .catch((err) => {
            throw Error(err.message);
        });
}