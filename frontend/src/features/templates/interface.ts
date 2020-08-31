export interface Category {
    id: number;
    name: string;
    description?: string;
    icon?: string;
    color?: string;
    forumId?: number;
    image?: string;
    subCategories: Category[];
    choices: Choice[];
}

export interface Choice {
    id: number;
    name: string;
    multiple: boolean;
    selections: Selection[];
}

export interface Selection {
    id: number;
    text: string;
    icon?: string;
}

export interface Step {
    id: number;
    choices: Choice[];
}

export interface Steps {
    steps: Step[];
    categories: Category[];
}