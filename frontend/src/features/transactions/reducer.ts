import { createSlice, PayloadAction } from 'redux-starter-kit';
import { Transaction } from './interface';

export type TransactionApiErrorAction = {
  error: string;
};

export type UpdateTransactions = {
    projectId: number
};

export type CreateTransaction = {
    projectId: number;
    amount: number;
    name: string;
    payer: string;
    transactionType: number;
    date?: string;
    time?: string;
    timezone?: string;
}

export type GetTransaction = {
    transactionId: number;
}

export type TransactionsAction = {
  transactions: Array<Transaction>;
};

export type DeleteTransaction = {
  transactionId: number
}

export type PatchTransaction = {
  transactionId: number,
  amount: number;
  name: string;
  payer: string;
  transactionType: number;
  date?: string;
  time?: string;
  timezone?: string;
}

let initialState = {
  transactions: [] as Array<Transaction>
};

const slice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    transactionsReceived: (
      state,
      action: PayloadAction<TransactionsAction>
    ) => {
      const { transactions } = action.payload;
      state.transactions = transactions;
    },
    transactionApiErrorReceived: (
      state,
      action: PayloadAction<TransactionApiErrorAction>
    ) => state,
    TransactionsUpdate: (state, action: PayloadAction<UpdateTransactions>) =>state,
    TransactionsCreate: (state, action: PayloadAction<CreateTransaction>) => state,
    TransactionGet: (state, action: PayloadAction<GetTransaction>) => state,
    TransactionDelete: (state, action: PayloadAction<DeleteTransaction>) => state,
    TransactionPatch: (state, action: PayloadAction<PatchTransaction>) => state,
    }
});

export const reducer = slice.reducer;
export const actions = slice.actions;