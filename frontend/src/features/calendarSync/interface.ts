import { Task } from "../tasks/interface";
import { Content } from "../myBuJo/interface";
import { Project } from '../project/interface';

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

export interface CalendarWatchedProject {
    calendarId: string;
    project: Project;
}

export interface GoogleCalendarEvent {
    task: Task;
    content: Content;
    eventId: string;
}