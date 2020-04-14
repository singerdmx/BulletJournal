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