import { ProjectItem } from "../myBuJo/interface";

export interface Transaction extends ProjectItem {
    amount: number,
    payer: string,
    date: string,
    time: string,
    timezone: string,
    transactionType: number
}