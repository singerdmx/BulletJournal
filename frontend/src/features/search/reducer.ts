import {createSlice, PayloadAction} from 'redux-starter-kit';
import {SearchResult} from "./interface";

export type SearchResultReceivedAction = {
    searchResult: SearchResult;
};

export type SearchAction = {
    term: string;
    scrollId?: string;
};

export type UpdateSearchingAction = {
    searching: boolean;
};

export type UpdateLoadingMoreAction = {
    loadingMore: boolean;
};

export type UpdateSearchPageNoAction = {
    searchPageNo: number;
};

export type UpdateSearchTermAction = {
    term: string;
};

let initialState = {
    searchResult: undefined as SearchResult | undefined,
    searchPageNo: 0,
    searching: false,
    loadingMore: false,
    searchTerm: ''
};

const slice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        searchResultReceived: (
            state,
            action: PayloadAction<SearchResultReceivedAction>
        ) => {
            const {searchResult} = action.payload;
            state.searchResult = searchResult;
        },
        updateSearchPageNo: (
            state,
            action: PayloadAction<UpdateSearchPageNoAction>
        ) => {
            const {searchPageNo} = action.payload;
            state.searchPageNo = searchPageNo;
            if (searchPageNo === 0) {
                state.searchResult = undefined;
            }
        },
        updateSearchTerm: (
            state,
            action: PayloadAction<UpdateSearchTermAction>
        ) => {
            const {term} = action.payload;
            state.searchTerm = term;
        },
        updateSearching: (state, action: PayloadAction<UpdateSearchingAction>) => {
            const {searching} = action.payload;
            state.searching = searching;
        },
        updateLoadingMore: (state, action: PayloadAction<UpdateLoadingMoreAction>) => {
            const {loadingMore} = action.payload;
            state.loadingMore = loadingMore;
        },
        search: (state, action: PayloadAction<SearchAction>) => state,
    }
});

export const reducer = slice.reducer;
export const actions = slice.actions;