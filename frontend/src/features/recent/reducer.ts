import { createSlice, PayloadAction } from 'redux-starter-kit';

let initialState = {
    startDate: '',
    endDate: '',
};

const slice = createSlice({
    name: 'myBuJo',
    initialState,
    reducers: {
    }
});

export const reducer = slice.reducer;
export const actions = slice.actions;