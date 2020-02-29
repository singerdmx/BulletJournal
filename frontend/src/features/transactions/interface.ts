export interface Transaction {
    id: number,
    amount: number,
    name: string,
    payer: string,
    projectId: number,
    date: string,
    time: string,
    timezone: string,
    transactionType: number
}