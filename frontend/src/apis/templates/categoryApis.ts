import {doDelete, doFetch, doPost, doPut} from '../api-helper';
import {Category} from "../../features/templates/interface";

export const getCategories = () => {
    return doFetch('/api/public/categories')
        .then((res) => res.json())
        .catch((err) => {
            throw Error(err.message);
        });
}

export const getCategory = (categoryId: number) => {
    return doFetch(`/api/public/categories/${categoryId}`)
        .then((res) => res.json())
        .catch((err) => {
            throw Error(err.message);
        });
}

export const createCategory = (
    name: string, description?: string, icon?: string, color?: string, forumId?: number,
    image?: string, nextStepId?: number) => {
    const postBody = JSON.stringify({
        name: name,
        description: description,
        icon: icon,
        color: color,
        forumId: forumId,
        image: image,
        nextStepId: nextStepId,
        needStartDate: false,
    });
    return doPost('/api/categories', postBody)
        .then(res => res.json())
        .catch(err => {
            throw Error(err.message);
        });
}

export const putCategory = (
    categoryId: number, name: string, needStartDate: boolean, description?: string, icon?: string,
    color?: string, forumId?: number, image?: string, nextStepId?: number) => {
    const putBody = JSON.stringify({
        name: name,
        needStartDate: needStartDate,
        description: description,
        icon: icon,
        color: color,
        forumId: forumId,
        image: image,
        nextStepId: nextStepId
    });
    return doPut(`/api/categories/${categoryId}`, putBody)
        .then(res => res.json())
        .catch(err => {
            throw Error(err.message);
        });
}

export const putCategories = (categories: Category[]) => {
    const putBody = JSON.stringify(categories);
    return doPut('/api/categories', putBody)
        .then(res => res.json())
        .catch(
            (err) => {
                throw Error(err.message);
            }
        );
};

export const deleteCategory = (categoryId: number) => {
    return doDelete(`/api/categories/${categoryId}`)
        .then(res => res.json())
        .catch((err) => {
            throw Error(err.message);
        });
};

export const updateChoicesForCategory = (categoryId: number, choicesIds: number[]) => {
    const putBody = JSON.stringify(choicesIds);
    return doPut(`/api/categories/${categoryId}/setChoices`, putBody)
        .then(res => res.json())
        .catch(
            (err) => {
                throw Error(err.message);
            }
        );
};

export const removeUserCategory = (categoryId: number, selectionId: number) => {
    const postBody = JSON.stringify({
        selectionId: selectionId,
    });
    return doPost(`/api/categories/${categoryId}/unsubscribe`, postBody)
        .then(res => res.json())
        .catch(err => {
            throw Error(err.message);
        });
}

export const updateSubscription = (categoryId: number, selectionId: number, projectId: number) => {
    const postBody = JSON.stringify({
        selectionId: selectionId,
        projectId: projectId
    });
    return doPost(`/api/categories/${categoryId}/updateSubscription`, postBody)
        .then(res => res.json())
        .catch(err => {
            throw Error(err.message);
        });
}