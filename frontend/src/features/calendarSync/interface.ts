import {Task} from "../tasks/interface";
import {Content} from "../myBuJo/interface";

export interface LoginStatus {
    loggedIn: boolean;
    expirationTime: number;
}

export interface CalendarListEntry {
    accessRole: string;
    backgroundColor: string;
    foregroundColor: string;
    summary: string;
    id: string;
    timeZone: string;
    primary: boolean;
    selected: boolean;
}

export interface GoogleCalendarEvent {
    task: Task;
    content: Content;
    iCalUID: string;
}