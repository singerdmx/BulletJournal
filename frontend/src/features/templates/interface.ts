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
}

export interface Choice {
    id: number;
    name: string;
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
    excludedSelections: Selection[];
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
    category: Category;
    step: Step;
}

export interface NextStep {
    step: Step;
}