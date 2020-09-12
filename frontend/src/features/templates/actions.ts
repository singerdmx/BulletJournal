import {actions} from './reducer';
import {Category} from "./interface";

export const getCategories = () => actions.getCategories({});

export const getCategory = (categoryId: number) => actions.getCategory({categoryId: categoryId});

export const addCategory = (
    name: string, description?: string, icon?: string, color?: string, forumId?: number, image?: string) =>
    actions.addCategory({
        name: name,
        description: description,
        icon: icon,
        color: color,
        forumId: forumId,
        image: image
    });

export const updateCategory = (
    categoryId: number, name: string, description?: string, icon?: string,
    color?: string, forumId?: number, image?: string, nextStepId?: number) =>
    actions.updateCategory({
        categoryId: categoryId,
        name: name,
        description: description,
        icon: icon,
        color: color,
        forumId: forumId,
        image: image,
        nextStepId: nextStepId
    });

export const updateCategoryRelations = (categories: Category[]) => actions.updateCategoryRelations({categories: categories});

export const deleteCategory = (id: number) => actions.deleteCategory({id: id});

export const setCategoryChoices = (id: number, choices: number[]) => actions.setCategoryChoices({
    id: id,
    choices: choices
});

export const getChoices = () => actions.getChoices({});

export const getChoice = (choiceId: number) => actions.getChoice({choiceId: choiceId});

export const addChoice = (name: string, multiple: boolean) => actions.addChoice({name: name, multiple: multiple});

export const deleteChoice = (id: number) => actions.deleteChoice({id: id});

export const updateChoice = (id: number, name: string, multiple: boolean) => actions.updateChoice({
    id: id,
    name: name,
    multiple: multiple
});

export const addSelection = (choiceId: number, text: string) => actions.addSelection({choiceId: choiceId, text: text});

export const deleteSelection = (id: number) => actions.deleteSelection({id: id});

export const updateSelection = (id: number, text: string) => actions.updateSelection({id: id, text: text});

export const getSteps = () => actions.getSteps({});

export const getStep = (stepId: number) => actions.getStep({stepId: stepId});

export const createStep = (name: string, nextStepId: number | undefined) => actions.createStep({name: name, nextStepId: nextStepId});

export const updateStep = (stepId: number, name: string, nextStepId: number | undefined) => actions.createStep({
    stepId: stepId, 
    name: name, 
    nextStepId: nextStepId
});

export const deleteStep = (stepId: number) => actions.deleteStep({stepId: stepId});

export const getNextStep = (stepId: number, selections: number[], first?: boolean) =>
    actions.getNextStep({stepId: stepId, selections: selections, first: first});

export const setStepChoices = (id: number, choices: number[]) => actions.setStepChoices({
    id: id,
    choices: choices
});
