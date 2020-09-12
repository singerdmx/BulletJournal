import {createSlice, PayloadAction} from 'redux-starter-kit';
import {Category, Choice, NextStep, Step} from './interface';

export type GetStepsAction = {};

export type GetStepAction = {
    stepId: number;
};

export type CreateStepAction = {
    name: string;
    nextStepId: number | undefined;
};

export type UpdateStepAction = {
    stepId: number;
    name: string;
    nextStepId: number | undefined;
};

export type StepsAction = {
    steps: Step[];
};

export type StepAction = {
    step: Step;
};

export type NextStepAction = {
    step: NextStep;
};

export type GetNextStepAction = {
    stepId: number;
    selections: number[];
    first?: boolean;
};

export type DeleteStepAction = {
    stepId: number;
};

export type GetCategoriesAction = {};

export type GetChoicesAction = {};

export type GetChoiceAction = {
    choiceId: number;
};

export type GetCategoryAction = {
    categoryId: number;
};

export type CategoriesAction = {
    categories: Category[];
};

export type ChoicesAction = {
    choices: Choice[];
};

export type CategoryAction = {
    category: Category;
};

export type AddCategoryAction = {
    name: string;
    description?: string;
    icon?: string;
    color?: string;
    forumId?: number;
    image?: string;
    nextStepId?: number;
};

export type UpdateCategoryAction = {
    categoryId: number;
    name: string;
    description?: string;
    icon?: string;
    color?: string;
    forumId?: number;
    image?: string;
    nextStepId?: number;
};

export type DeleteCategoryAction = {
    id: number;
};

export type DeleteChoiceAction = {
    id: number;
};

export type DeleteSelectionAction = {
    id: number;
};

export type UpdateCategoryRelationsAction = {
    categories: Category[];
};

export type SetChoicesAction = {
    categoryId: number;
    choices: number[];
};

export type AddChoiceAction = {
    name: string;
    multiple: boolean;
};

export type UpdateChoiceAction = {
    id: number;
    name: string;
    multiple: boolean;
};

export type AddSelectionAction = {
    choiceId: number;
    text: string;
};

export type UpdateSelectionAction = {
    id: number;
    text: string;
};

let initialState = {
    categories: [] as Category[],
    category: undefined as Category | undefined,
    choices: [] as Choice[],
    steps: [] as Step[],
    step: undefined as Step | undefined,
    nextStep: undefined as NextStep | undefined
};

const slice = createSlice({
    name: 'templates',
    initialState,
    reducers: {
        categoriesReceived: (state, action: PayloadAction<CategoriesAction>) => {
            const {categories} = action.payload;
            state.categories = categories;
        },
        choicesReceived: (state, action: PayloadAction<ChoicesAction>) => {
            const {choices} = action.payload;
            state.choices = choices;
        },
        categoryReceived: (state, action: PayloadAction<CategoryAction>) => {
            const {category} = action.payload;
            state.category = category;
        },
        getCategories: (state, action: PayloadAction<GetCategoriesAction>) => state,
        getChoices: (state, action: PayloadAction<GetChoicesAction>) => state,
        getChoice: (state, action: PayloadAction<GetChoiceAction>) => state,
        getCategory: (state, action: PayloadAction<GetCategoryAction>) => state,
        addCategory: (state, action: PayloadAction<AddCategoryAction>) => state,
        updateCategory: (state, action: PayloadAction<UpdateCategoryAction>) => state,
        deleteCategory: (state, action: PayloadAction<DeleteCategoryAction>) => state,
        deleteChoice: (state, action: PayloadAction<DeleteChoiceAction>) => state,
        updateCategoryRelations: (state, action: PayloadAction<UpdateCategoryRelationsAction>) => state,
        setChoices: (state, action: PayloadAction<SetChoicesAction>) => state,
        addChoice: (state, action: PayloadAction<AddChoiceAction>) => state,
        updateChoice: (state, action: PayloadAction<UpdateChoiceAction>) => state,
        addSelection: (state, action: PayloadAction<AddSelectionAction>) => state,
        deleteSelection: (state, action: PayloadAction<DeleteSelectionAction>) => state,
        updateSelection: (state, action: PayloadAction<UpdateSelectionAction>) => state,
        getSteps: (state, action: PayloadAction<GetStepsAction>) => state,
        stepsReceived: (state, action: PayloadAction<StepsAction>) => {
            const {steps} = action.payload;
            state.steps = steps;
        },
        nextStepReceived: (state, action: PayloadAction<NextStepAction>) => {
            const {step} = action.payload;
            state.nextStep = step;
        },
        getStep: (state, action: PayloadAction<GetStepAction>) => state,
        stepReceived: (state, action: PayloadAction<StepAction>) => {
            const {step} = action.payload;
            state.step = step;
        },
        createStep: (state, action: PayloadAction<CreateStepAction>) => state,
        updateStep: (state, action: PayloadAction<UpdateStepAction>) => state,
        deleteStep: (state, action: PayloadAction<DeleteStepAction>) => state,
        getNextStep: (state, action: PayloadAction<GetNextStepAction>) => state,
    },
});

export const reducer = slice.reducer;
export const actions = slice.actions;
