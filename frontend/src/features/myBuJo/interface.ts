import { Task } from '../tasks/interface';
import { Note } from '../notes/interface';
import { Transaction } from '../transactions/interface';
import { Label } from '../label/interface';

export interface ProjectItems {
    tasks: Task[];
    notes: Note[];
    transactions: Transaction[];
    date: string;
    dayOfWeek: string;
}

export interface ProjectItem {
    id: number,
    name: string,
    projectId: number,
    labels: Label[]
}