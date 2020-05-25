import {createSlice, PayloadAction} from 'redux-starter-kit';
import {ProjectItem} from "../myBuJo/interface";
import moment from "moment";

export type RecentItemsReceivedAction = {
    items: ProjectItem[];
};

export type DatesReceivedAction = {
    startDate: string;
    endDate: string;
};

let initialState = {
    startDate: moment().startOf('month').format('YYYY-MM-DD'),
    endDate: moment().endOf('month').format('YYYY-MM-DD'),
    items: [] as ProjectItem[],
};

const slice = createSlice({
    name: 'recent',
    initialState,
    reducers: {
        recentItemsReceived: (
            state,
            action: PayloadAction<RecentItemsReceivedAction>
        ) => {
            const {items} = action.payload;
            state.items = items;
        },
        datesReceived: (state, action: PayloadAction<DatesReceivedAction>) => {
            const {startDate, endDate} = action.payload;
            state.startDate = startDate;
            state.endDate = endDate;
        },
        updateRecentDates: (state, action: PayloadAction<DatesReceivedAction>) => state,
    }
});

export const reducer = slice.reducer;
export const actions = slice.actions;