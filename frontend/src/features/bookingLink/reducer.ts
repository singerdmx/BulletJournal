import {createSlice, PayloadAction} from "redux-starter-kit";
import {Booking, BookingLink, Invitee, RecurringSpan, Slot} from "./interface";

export type LinkAction = {
    link: BookingLink;
};

export type BookingAction = {
    booking: Booking;
};

export type BookMeUsernameAction = {
    name: string;
}

export type FetchBookMeUsername = {
}

export type BookingLinksAction = {
    links: BookingLink[];
}

export type FetchBookingLinks = {
}

export type FetchBookingLink = {
    bookingLinkId: string,
    timezone?: string
}

export type FetchBooking = {
    bookingId: string,
}

export type CancelBooking = {
    bookingId: string,
    name: string,
    onSuccess: Function
}

export type UpdateBookingLinkRecurrences = {
    bookingLinkId: string,
    recurrences: RecurringSpan[],
    timezone: string
}

export type UpdateBookingLinkSlot = {
    bookingLinkId: string,
    slot: Slot,
    timezone: string
}

export type AddBookingLink = {
    afterEventBuffer: number,
    beforeEventBuffer: number,
    endDate: string,
    expireOnBooking: boolean,
    includeTaskWithoutDuration: boolean,
    projectId: number,
    recurrences: RecurringSpan[],
    slotSpan: number,
    startDate: string,
    timezone: string,
    onSuccess: Function
};

export type PatchBookingLink = {
    bookingLinkId: string,
    timezone: string,
    afterEventBuffer?: number,
    beforeEventBuffer?: number,
    endDate?: string,
    expireOnBooking?: boolean,
    includeTaskWithoutDuration?: boolean,
    location?: string,
    projectId?: number,
    startDate?: string,
    note?: string
};

export type CreateBooking = {
    bookingLinkId: string,
    invitees: Invitee[],
    slotIndex: number,
    slotDate: string,
    location: string,
    note: string,
    requesterTimezone: string,
    displayDate: string;
    startTime: string;
    endTime: string;
    onSuccess: (bookingId: string) => void
}

let initialState = {
    link: undefined as BookingLink | undefined,
    booking: undefined as Booking | undefined,
    bookMeUsername: '',
    links: [] as BookingLink[],
};

const slice = createSlice({
    name: 'bookingLinks',
    initialState,
    reducers: {
        linkReceived: (state, action: PayloadAction<LinkAction>) => {
            const { link } = action.payload;
            state.link = link;
        },
        bookingReceived: (state, action: PayloadAction<BookingAction>) => {
            const { booking } = action.payload;
            state.booking = booking;
        },
        bookMeUsernameReceived: (state, action: PayloadAction<BookMeUsernameAction>) => {
            const { name } = action.payload;
            state.bookMeUsername = name;
        },
        bookingLinksReceived: (state, action: PayloadAction<BookingLinksAction>) => {
            const { links } = action.payload;
            state.links = links;
        },
        AddBookingLink: (state, action: PayloadAction<AddBookingLink>) => state,
        PatchBookingLink: (state, action: PayloadAction<PatchBookingLink>) => state,
        GetBookMeUsername: (state, action: PayloadAction<FetchBookMeUsername>) => state,
        UpdateBookMeUsername: (state, action: PayloadAction<BookMeUsernameAction>) => state,
        GetBookingLinks: (state, action: PayloadAction<FetchBookingLinks>) => state,
        GetBookingLink: (state, action: PayloadAction<FetchBookingLink>) => state,
        UpdateBookingLinkRecurrences: (state, action: PayloadAction<UpdateBookingLinkRecurrences>) => state,
        UpdateBookingLinkSlot: (state, action: PayloadAction<UpdateBookingLinkSlot>) => state,
        CreateBooking: (state, action: PayloadAction<CreateBooking>) => state,
        GetBooking: (state, action: PayloadAction<FetchBooking>) => state,
        CancelBooking: (state, action: PayloadAction<CancelBooking>) => state,
    }
});

export const reducer = slice.reducer;
export const actions = slice.actions;
