import {actions} from "./reducer";
import {BookingLink, RecurringSpan} from "./interface";

export const addBookingLink = (
    bufferInMin: number,
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
        bufferInMin: bufferInMin,
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