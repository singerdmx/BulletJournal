import {actions} from './reducer';

export const getCategories = () => actions.getCategories({});

export const addCategory = (name: string, description: string) => actions.addCategory({
    name: name,
    description: description
});
