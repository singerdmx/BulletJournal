import {Project} from "../project/interface";

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
    endTime: string;
    expireOnBooking: boolean;
    includeTaskWithoutDuration: boolean;
    location: string;
    note: string;
    owner: string;
    project: Project;
    slotSpan: number;
    startDate: string;
    startTime: string;
    timezone: string;
    slots: Slot[];
    recurrences: RecurringSpan[];
}