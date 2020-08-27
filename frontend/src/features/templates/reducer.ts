import {createSlice, PayloadAction} from 'redux-starter-kit';
import {Category} from './interface';

export type GetCategoriesAction = {};

export type GetCategoryAction = {
    categoryId: number;
};

export type CategoriesAction = {
    categories: Category[];
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
};

export type UpdateCategoryAction = {
    categoryId: number;
    name: string;
    description?: string;
    icon?: string;
    color?: string;
    forumId?: number;
    image?: string;
};

export type DeleteCategoryAction = {
    id: number;
};

export type UpdateCategoryRelationsAction = {
    categories: Category[];
};

let initialState = {
    categories: [] as Category[],
    category: undefined as Category | undefined,
};

const slice = createSlice({
    name: 'templates',
    initialState,
    reducers: {
        categoriesReceived: (state, action: PayloadAction<CategoriesAction>) => {
            const {categories} = action.payload;
            state.categories = categories;
        },
        categoryReceived: (state, action: PayloadAction<CategoryAction>) => {
            const {category} = action.payload;
            state.category = category;
        },
        getCategories: (state, action: PayloadAction<GetCategoriesAction>) => state,
        getCategory: (state, action: PayloadAction<GetCategoryAction>) => state,
        addCategory: (state, action: PayloadAction<AddCategoryAction>) => state,
        updateCategory: (state, action: PayloadAction<UpdateCategoryAction>) => state,
        deleteCategory: (state, action: PayloadAction<DeleteCategoryAction>) => state,
        updateCategoryRelations: (state, action: PayloadAction<UpdateCategoryRelationsAction>) => state
    },
});

export const reducer = slice.reducer;
export const actions = slice.actions;
