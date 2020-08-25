export interface Category {
    id: number;
    name: string;
    description?: string;
    icon?: string;
    color?: string;
    forumId?: number;
    subCategories: Category[];
}