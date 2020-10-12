import {doDelete, doFetch, doPost, doPut} from '../api-helper';

export const getNext = (stepId: number, selections: number[], prevSelections: number[], first?: boolean) => {
    let url = `/api/public/steps/${stepId}/next?`;
    url += selections.map(s => `selections=${s}`).join('&');
    if (prevSelections.length > 0) {
        url += '&' + prevSelections.map(s => `prevSelections=${s}`).join('&');
    }
    if (first) {
        url += '&first=true';
    }
    return doFetch(url)
        .then((res) => res.json())
        .catch((err) => {
            throw Error(err.message);
        });
}

export const fetchSampleTasksByScrollId = (scrollId: string, pageSize: number) => {
    return doFetch(`/api/public/sampleTasks?scrollId=${scrollId}&pageSize=${pageSize}`)
        .then((res) => res.json())
        .catch((err) => {
            throw Error(err.message);
        });
}

export const getSampleTasksByFilter = (filter: string) => {
    return doFetch(`/api/sampleTasks?filter=${filter}`)
        .then((res) => res.json())
        .catch((err) => {
            throw Error(err.message);
        });
}

export const createSampleTask = (name: string, uid: string, content: string, metadata: string) => {
    const postBody = JSON.stringify({
        name: name,
        uid: uid,
        content: content,
        metadata: metadata
    });
    return doPost('/api/sampleTasks', postBody)
        .then(res => res.json())
        .catch(err => {
            throw Error(err.message);
        });
}

export const fetchAdminSampleTask = (sampleTaskId: number) => {
    return doFetch(`/api/admin/sampleTasks/${sampleTaskId}`)
        .then((res) => res.json())
        .catch((err) => {
            throw Error(err.message);
        });
}

export const fetchUserSampleTasks = () => {
    return doFetch('/api/userSampleTasks')
        .then((res) => res.json())
        .catch((err) => {
            throw Error(err.message);
        });
}

export const fetchSampleTask = (sampleTaskId: number) => {
    return doFetch(`/api/public/sampleTasks/${sampleTaskId}`)
        .then((res) => res.json())
        .catch((err) => {
            throw Error(err.message);
        });
}

export const deleteSampleTask = (sampleTaskId: number) => {
    return doDelete(`/api/sampleTasks/${sampleTaskId}`)
        .then(res => res)
        .catch((err) => {
            throw Error(err.message);
        });
}

export const putSampleTask = (sampleTaskId: number, name: string, uid: string, content: string, metadata: string, pending: boolean, refreshable: boolean) => {
    const putBody = JSON.stringify({
        name: name,
        uid: uid,
        content: content,
        metadata: metadata,
        pending: pending,
        refreshable: refreshable,
    });
    return doPut(`/api/sampleTasks/${sampleTaskId}`, putBody)
        .then(res => res.json())
        .catch(err => {
            throw Error(err.message);
        });
}

export const upsertSampleTaskRule = (stepId: number, selectionCombo: string, taskIds: string) => {
    const postBody = JSON.stringify({
        stepId: stepId,
        selectionCombo: selectionCombo,
        taskIds: taskIds
    });
    return doPost('/api/sampleTaskRules', postBody)
        .then(res => res.json())
        .catch(err => {
            throw Error(err.message);
        });
}

export const deleteSampleTaskRule = (stepId: number, selectionCombo: string) => {
    return doDelete(`/api/sampleTaskRules?stepId=${stepId}&selectionCombo=${selectionCombo}`)
        .then(res => res)
        .catch((err) => {
            throw Error(err.message);
        });
}

export const importSampleTasks = (sampleTasks: number[], selections: number[], categoryId: number,
                                  projectId: number, assignees: string[], scrollId: string,
                                  reminderBefore: number, labels: number[], subscribed: boolean,
                                  startDate?: string, timezone?: string) => {
    const postBody = JSON.stringify({
        sampleTasks: sampleTasks,
        selections: selections,
        categoryId: categoryId,
        projectId: projectId,
        assignees: assignees,
        scrollId: scrollId,
        reminderBefore: reminderBefore,
        labels: labels,
        subscribed: subscribed,
        startDate: startDate,
        timezone: timezone
    });
    return doPost('/api/sampleTasks/import', postBody)
        .then(res => res.json())
        .catch(err => {
            throw Error(err.message);
        });
}

export const getUserSubscribedCategories = () => {
    return doFetch('/api/subscribedCategories')
        .then((res) => res.json())
        .catch((err) => {
            throw Error(err.message);
        });
}

export const fetchCategorySteps = (categoryId: number) => {
    return doFetch(`/api/categories/${categoryId}/steps`)
        .then((res) => res.json())
        .catch((err) => {
            throw Error(err.message);
        });
}

export const auditSampleTask = (sampleTaskId: number, choiceId: number, selections: number[]) => {
    const postBody = JSON.stringify({
        choiceId: choiceId,
        selections: selections,
    });
    return doPost(`/api/sampleTasks/${sampleTaskId}/audit`, postBody)
        .then((res) => res.json())
        .catch((err) => {
            throw Error(err.message);
        });
}

export const removeUserSampleTask = (sampleTaskId: number) => {
    return doDelete(`/api/userSampleTasks/${sampleTaskId}`)
        .then((res) => res.json())
        .catch((err) => {
            throw Error(err.message);
        });
}

export const removeUserSampleTasks = (sampleTasks: number[],
                                      projectId: number, assignees: string[],
                                      reminderBefore: number, labels: number[],
                                      startDate?: string, timezone?: string) => {
    const postBody = JSON.stringify({
        sampleTasks: sampleTasks,
        projectId: projectId,
        assignees: assignees,
        reminderBefore: reminderBefore,
        labels: labels,
        startDate: startDate,
        timezone: timezone
    });
    return doPost('/api/userSampleTasks/remove', postBody)
        .then((res) => res.json())
        .catch((err) => {
            throw Error(err.message);
        });
}
