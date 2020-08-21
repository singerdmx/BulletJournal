export interface Category {
    id: number;
    name: string;
    description: string;
    subCategories: Category[];
}