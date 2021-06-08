import { doDelete, doFetch, doPatch, doPost, doPut } from "./api-helper";
import { Invitee, RecurringSpan, Slot } from "../features/bookingLink/interface";

export const createBookingLink = (
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
) => {
    const postBody = JSON.stringify({
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
    return doPost('/api/bookingLinks', postBody)
        .then(res => res.json())
        .catch(err => {
            throw Error(err.message);
        });
};

export const updateBookingLink = (
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
) => {
    const patchBody = JSON.stringify({
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
    return doPatch(`/api/bookingLinks/${bookingLinkId}`, patchBody)
        .then((res) => res.json())
        .catch((err) => {
            throw Error(err.message);
        });
}

export const deleteBooking = (bookingLinkId: string) => {
    return doDelete(`/api/bookingLinks/${bookingLinkId}`)
        .then(res => res)
        .catch(err => {
            throw Error(err.message);
        });
};

export const updateBookingLinkRecurrences = (
    bookingLinkId: string,
    recurrences: RecurringSpan[],
    timezone: string) => {
    const postBody = JSON.stringify({
        recurrences: recurrences,
        timezone: timezone,
    });
    return doPost(`/api/bookingLinks/${bookingLinkId}/updateRecurrenceRules`, postBody)
        .then((res) => res.json())
        .catch((err) => {
            throw Error(err.message);
        });
}

export const updateBookingLinkSlot = (
    bookingLinkId: string,
    slot: Slot,
    timezone: string) => {
    const postBody = JSON.stringify({
        bookingSlot: slot,
        timezone: timezone,
    });
    return doPost(`/api/bookingLinks/${bookingLinkId}/updateSlot`, postBody)
        .then((res) => res.json())
        .catch((err) => {
            throw Error(err.message);
        });
}

export const getBookMeUsername = () => {
    return doFetch('/api/bookMeUsername')
        .catch(err => {
            throw Error(err.message);
        });
}

export const updateBookMeUsername = (name: string) => {
    return doPut('/api/bookMeUsername', name)
        .catch((err) => {
            throw Error(err.message);
        });
}

export const getBookingLinks = () => {
    return doFetch('/api/bookingLinks')
        .then((res) => res.json())
        .catch(err => {
            throw Error(err.message);
        });
}

export const getBookingLink = (bookingLinkId: string,
    timezone?: string) => {
    let url = `/api/public/bookingLinks/${bookingLinkId}`;
    if (timezone) {
        url += `?timezone=${encodeURIComponent(timezone)}`;
    }
    return doFetch(url)
        .then((res) => res.json())
        .catch(err => {
            throw Error(err.message);
        });
}

export const book = (bookingLinkId: string,
    invitees: Invitee[],
    slotIndex: number,
    slotDate: string,
    location: string,
    note: string,
    requesterTimezone: string,
    displayDate: string,
    startTime: string,
    endTime: string) => {

    const postBody = JSON.stringify({
        invitees: invitees,
        slotIndex: slotIndex,
        slotDate: slotDate,
        location: location,
        note: note,
        requesterTimezone: requesterTimezone,
        displayDate: displayDate,
        startTime: startTime,
        endTime: endTime
    });
    return doPost(`/api/public/bookingLinks/${bookingLinkId}/book`, postBody)
        .then((res) => res.json())
        .catch((err) => {
            throw Error(err.message);
        });
}

export const cancelBooking = (bookingId: string, name: string) => {
    const postBody = JSON.stringify({
        name: name,
    });
    return doPost(`/api/public/bookings/${bookingId}/cancel`, postBody)
        .catch((err) => {
            throw Error(err.message);
        });
}

export const getBooking = (bookingId: string) => {
    const url = `/api/public/bookings/${bookingId}`;
    return doFetch(url)
        .then((res) => res.json())
        .catch(err => {
            throw Error(err.message);
        });
}
