import {doDelete, doFetch, doPost, doPut} from '../api-helper';
import {Category} from "../../features/templates/interface";

export const getCategories = () => {
    return doFetch('/api/categories')
        .then((res) => res.json())
        .catch((err) => {
            throw Error(err.message);
        });
}

export const getCategory = (categoryId: number) => {
    return doFetch(`/api/categories/${categoryId}`)
        .then((res) => res.json())
        .catch((err) => {
            throw Error(err.message);
        });
}

export const createCategory = (name: string, description?: string, icon?: string, color?: string, forumId?: number) => {
    const postBody = JSON.stringify({
        name: name,
        description: description,
        icon: icon,
        color: color,
        forumId: forumId
    });
    return doPost('/api/categories', postBody)
        .then(res => res.json())
        .catch(err => {
            throw Error(err.message);
        });
}

export const putCategory = (
    categoryId: number, name: string, description?: string, icon?: string, color?: string, forumId?: number) => {
    const putBody = JSON.stringify({
        name: name,
        description: description,
        icon: icon,
        color: color,
        forumId: forumId
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