import {User} from "../group/interface";

export interface Notification {
    id: number;
    title: string;
    content: string;
    timestamp: number;
    originator: User;
    actions: Array<string>;
    type: string;
    link: string;
}