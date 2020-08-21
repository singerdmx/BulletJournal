import {actions} from './reducer';
import {Category} from "./interface";

export const getCategories = () => actions.getCategories({});

export const addCategory = (name: string, description: string) => actions.addCategory({
    name: name,
    description: description
});

export const updateCategoryRelations = (categories: Category[]) => actions.updateCategoryRelations({categories: categories});

export const deleteCategory = (id: number) => actions.deleteCategory({id: id});
