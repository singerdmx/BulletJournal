import {createSlice, PayloadAction} from 'redux-starter-kit';
import {SearchResult} from "./interface";

export type SearchResultReceivedAction = {
    searchResult: SearchResult;
};

export type SearchAction = {
    term: string;
    scrollId?: string;
};

export type UpdateSearchPageNoAction = {
    searchPageNo: number;
};

let initialState = {
    searchResult: undefined as SearchResult | undefined,
    searchPageNo: 0,
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
        },
        search: (state, action: PayloadAction<SearchAction>) => state,
    }
});

export const reducer = slice.reducer;
export const actions = slice.actions;