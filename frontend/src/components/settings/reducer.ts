import { createSlice, PayloadAction } from 'redux-starter-kit';

type TimezoneSaveButtonAction = {
    timezoneSaveButtonVisible: boolean;
}

let initialState = {
    timezoneSaveButtonVisible: false,
}

const slice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        updateTimezoneSaveButtonVisiblility: (state, action: PayloadAction<TimezoneSaveButtonAction>) => {
            const { timezoneSaveButtonVisible } = action.payload;
            state.timezoneSaveButtonVisible = timezoneSaveButtonVisible;
        },
    }
});

export const reducer = slice.reducer;
export const actions = slice.actions;