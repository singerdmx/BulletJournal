import {Project} from "../project/interface";
import {User} from "../group/interface";

export interface RecurringSpan {
    duration: number;
    recurrenceRule: string;
}

export interface Slot {
    date: string;
    displayDate: string;
    startTime: string;
    endTime: string;
    index: number;
    on: boolean;
}

export interface BookingLink {
    id: string;
    afterEventBuffer: number;
    beforeEventBuffer: number;
    endDate: string;
    expireOnBooking: boolean;
    includeTaskWithoutDuration: boolean;
    location: string;
    note: string;
    owner: User;
    ownerName: string;
    project: Project;
    slotSpan: number;
    startDate: string;
    timezone: string;
    slots: Slot[];
    recurrences: RecurringSpan[];
    bookings: Booking[];
    removed: boolean;
}

export interface Booking {
    id: string;
    invitees: Invitee[];
    slotIndex: number;
    slotDate: string;
    location: string;
    note: string;
    displayDate: string;
    startTime: string;
    endTime: string;
    requesterTimezone: string;
    bookingLink: BookingLink;
}

export interface Invitee {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
}