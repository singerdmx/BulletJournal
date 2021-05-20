import {createSlice, PayloadAction} from "redux-starter-kit";
import {BookingLink, RecurringSpan} from "./interface";

export type LinkAction = {
    link: BookingLink;
};

export type AddBookingLink = {
    bufferInMin: number,
    endDate: string,
    expireOnBooking: boolean,
    includeTaskWithoutDuration: boolean,
    projectId: number,
    recurrences: RecurringSpan[],
    slotSpan: number,
    startDate: string,
    timezone: string,
};

let initialState = {
    link: undefined as BookingLink | undefined,
};

const slice = createSlice({
    name: 'bookingLinks',
    initialState,
    reducers: {
        linkReceived: (state, action: PayloadAction<LinkAction>) => {
            const { link } = action.payload;
            // @ts-ignore
            state.link = link;
        },
        AddBookingLink: (state, action: PayloadAction<AddBookingLink>) => state,
    }
});

export const reducer = slice.reducer;
export const actions = slice.actions;
