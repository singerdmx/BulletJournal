import { Task } from '../tasks/interface';
import { Note } from '../notes/interface';
import { Transaction } from '../transactions/interface';

export interface ProjectItems {
    tasks: Task[];
    notes: Note[];
    transactions: Transaction[];
    date: string;
    dayOfWeek: string;
}