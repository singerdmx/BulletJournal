import {actions} from "./reducer";
import {BookingLink, RecurringSpan} from "./interface";

export const getBookMeUsername = () => actions.GetBookMeUsername({});

export const updateBookMeUsername = (name: string) => actions.UpdateBookMeUsername({name: name});

export const getBookingLinks = () => actions.GetBookingLinks({});

export const addBookingLink = (
    afterEventBuffer: number,
    beforeEventBuffer: number,
    endDate: string,
    expireOnBooking: boolean,
    includeTaskWithoutDuration: boolean,
    projectId: number,
    recurrences: RecurringSpan[],
    slotSpan: number,
    startDate: string,
    timezone: string
) =>
    actions.AddBookingLink({
        afterEventBuffer: afterEventBuffer,
        beforeEventBuffer: beforeEventBuffer,
        endDate: endDate,
        expireOnBooking: expireOnBooking,
        includeTaskWithoutDuration: includeTaskWithoutDuration,
        projectId: projectId,
        recurrences: recurrences,
        slotSpan: slotSpan,
        startDate: startDate,
        timezone: timezone
    });

export const linkReceived = (link: BookingLink) =>
    actions.linkReceived({link: link});

export const patchBookingLink = (
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
) =>
    actions.PatchBookingLink({
        bookingLinkId: bookingLinkId,
        timezone: timezone,
        afterEventBuffer: afterEventBuffer,
        beforeEventBuffer: beforeEventBuffer,
        endDate: endDate,
        expireOnBooking: expireOnBooking,
        includeTaskWithoutDuration: includeTaskWithoutDuration,
        location: location,
        projectId: projectId,
        startDate: startDate,
        note: note
    });