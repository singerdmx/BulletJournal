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