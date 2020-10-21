import {createSlice, PayloadAction} from 'redux-starter-kit';
import {Category, Choice, NextStep, Rule, SampleTask, Step} from './interface';

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
    step: NextStep | undefined;
};

export type GetNextStepAction = {
    stepId: number;
    selections: number[];
    prevSelections: number[];
    first?: boolean;
};

export type ImportTasksAction = {
    postOp: Function;
    timeoutOp: Function;
    sampleTasks: number[];
    selections: number[];
    categoryId: number;
    projectId: number;
    assignees: string[];
    reminderBefore: number;
    labels: number[];
    subscribed: boolean;
    startDate?: string;
    timezone?: string;
};

export type DeleteStepAction = {
    stepId: number;
};

export type CloneStepAction = {
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

export type LoadingNextStepAction = {
    loading: boolean;
};

export type ChoicesAction = {
    choices: Choice[];
};

export type ChoiceAction = {
    choice: Choice;
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
    needStartDate: boolean;
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
    id: number;
    choices: number[];
};

export type SetExcludedSelectionsAction = {
    id: number;
    selections: number[];
};

export type AddChoiceAction = {
    name: string;
    multiple: boolean;
};

export type UpdateChoiceAction = {
    id: number;
    name: string;
    multiple: boolean;
    instructionIncluded: boolean;
};

export type AddSelectionAction = {
    choiceId: number;
    text: string;
};

export type UpdateSelectionAction = {
    id: number;
    text: string;
};

export type RuleAction = {
    rule: Rule;
};

export type AddRuleAction = {
    name: string;
    priority: number;
    connectedStepId: number;
    ruleExpression: string;
    categoryId?: number;
    stepId?: number;
};

export type RemoveRuleAction = {
    ruleId: number;
    ruleType: string;
};

export type RemoveSampleTaskAction = {
    taskId: number;
};

export type GetSampleTasksAction = {
    filter: string;
};

export type SampleTasksAction = {
    tasks: SampleTask[];
    scrollId: string;
};

export type SampleTaskAction = {
    task: SampleTask | undefined;
};

export type AddSampleTaskAction = {
    name: string;
    uid: string;
    content: string;
    metadata: string;
};

export type UpdateSampleTaskAction = {
    sampleTaskId: number;
    name: string;
    uid: string;
    content: string;
    metadata: string;
    pending: boolean;
    refreshable: boolean;
};

export type GetSampleTasksByScrollIdAction = {
    scrollId: string;
    pageSize: number;
};

export type GetSampleTaskAction = {
    sampleTaskId: number;
};

export type SetSampleTaskRuleAction = {
    stepId: number;
    selectionCombo: string;
    taskIds: string;
};

export type RemoveSampleTaskRuleAction = {
    stepId: number;
    selectionCombo: string;
};

let initialState = {
    loadingNextStep: false,
    scrollId: '',
    categories: [] as Category[],
    category: undefined as Category | undefined,
    choices: [] as Choice[],
    choice: undefined as Choice | undefined,
    steps: [] as Step[],
    step: undefined as Step | undefined,
    nextStep: undefined as NextStep | undefined,
    rule: undefined as Rule | undefined,
    sampleTasks: [] as SampleTask[],
    sampleTask: undefined as SampleTask | undefined,
};

const slice = createSlice({
    name: 'templates',
    initialState,
    reducers: {
        loadingNextStepReceived: (state, action: PayloadAction<LoadingNextStepAction>) => {
            const {loading} = action.payload;
            state.loadingNextStep = loading;
        },
        categoriesReceived: (state, action: PayloadAction<CategoriesAction>) => {
            const {categories} = action.payload;
            state.categories = categories;
        },
        choicesReceived: (state, action: PayloadAction<ChoicesAction>) => {
            const {choices} = action.payload;
            state.choices = choices;
        },
        choiceReceived: (state, action: PayloadAction<ChoiceAction>) => {
            const {choice} = action.payload;
            state.choice = choice;
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
        setCategoryChoices: (state, action: PayloadAction<SetChoicesAction>) => state,
        setStepChoices: (state, action: PayloadAction<SetChoicesAction>) => state,
        setStepExcludedSelections: (state, action: PayloadAction<SetExcludedSelectionsAction>) => state,
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
        ruleReceived: (state, action: PayloadAction<RuleAction>) => {
            const {rule} = action.payload;
            state.rule = rule;
        },
        createRule: (state, action: PayloadAction<AddRuleAction>) => state,
        removeRule: (state, action: PayloadAction<RemoveRuleAction>) => state,
        sampleTasksReceived: (state, action: PayloadAction<SampleTasksAction>) => {
            const {tasks, scrollId} = action.payload;
            const res = [] as SampleTask[];
            const set = new Set();
            tasks.forEach(task => {
                if (!set.has(task.id)) {
                    res.push(task);
                    set.add(task.id);
                }
            });
            state.sampleTasks = res;
            state.scrollId = scrollId;
        },
        getSampleTasks: (state, action: PayloadAction<GetSampleTasksAction>) => state,
        addSampleTask: (state, action: PayloadAction<AddSampleTaskAction>) => state,
        updateSampleTask: (state, action: PayloadAction<UpdateSampleTaskAction>) => state,
        getSampleTask: (state, action: PayloadAction<GetSampleTaskAction>) => state,
        sampleTaskReceived: (state, action: PayloadAction<SampleTaskAction>) => {
            const {task} = action.payload;
            state.sampleTask = task;
        },
        removeSampleTask: (state, action: PayloadAction<RemoveSampleTaskAction>) => state,
        copyStep: (state, action: PayloadAction<CloneStepAction>) => state,
        getSampleTasksByScrollId: (state, action: PayloadAction<GetSampleTasksByScrollIdAction>) => state,
        importTasks: (state, action: PayloadAction<ImportTasksAction>) => state,
        setSampleTaskRule: (state, action: PayloadAction<SetSampleTaskRuleAction>) => state,
        removeSampleTaskRule: (state, action: PayloadAction<RemoveSampleTaskRuleAction>) => state,
    },
});

export const reducer = slice.reducer;
export const actions = slice.actions;
