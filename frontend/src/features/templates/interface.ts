export interface Category {
    id: number;
    name: string;
    description?: string;
    icon?: string;
    color?: string;
    forumId?: number;
    image?: string;
    nextStepId?: number;
    subCategories: Category[];
    choices: Choice[];
    rules: Rule[]
    needStartDate: boolean;
}

export interface Choice {
    id: number;
    name: string;
    instructionIncluded: boolean;
    multiple: boolean;
    selections: Selection[];
    categories: Category[];
    steps: Step[];
}

export interface Selection {
    id: number;
    text: string;
    icon?: string;
}

export interface Step {
    id: number;
    name: string;
    choices: Choice[];
    excludedSelections: number[];
    rules: Rule[];
    nextStepId?: number;
}

export interface Steps {
    steps: Step[];
    categories: Category[];
}

export interface Rule {
    id: number;
    name: string;
    priority: number;
    ruleExpression: string;
    category?: Category;
    step?: Step;
    connectedStep: Step;
}

export interface NextStep {
    step: Step;
    sampleTasks: SampleTask[];
    scrollId: string;
}

export interface SampleTask {
    id: number;
    name: string;
    content: string;
    metadata: string;
    uid: string;
    steps: Step[];
    choice?: Choice;
    pending: boolean;
    refreshable: boolean;
    raw: string;
}

export interface SampleTasks {
    sampleTasks: SampleTask[];
    scrollId: string;
}