import {doPost} from "./api-helper";
import {RecurringSpan} from "../features/bookingLink/interface";

export const createBookingLink = (
    bufferInMin: number,
    endDate: string,
    expireOnBooking: boolean,
    includeTaskWithoutDuration: boolean,
    projectId: number,
    recurrences: RecurringSpan[],
    slotSpan: number,
    startDate: string,
    timezone: string
) => {
    const postBody = JSON.stringify({
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
    return doPost('/api/bookingLinks', postBody)
        .then(res => res.json())
        .catch(err => {
            throw Error(err.message);
        });
};