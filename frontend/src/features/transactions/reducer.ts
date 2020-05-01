import { createSlice, PayloadAction } from 'redux-starter-kit';
import {
  Transaction,
  LedgerSummary,
  FrequencyType,
  LedgerSummaryType,
} from './interface';
import { History } from 'history';
import { Content } from '../myBuJo/interface';

export type TransactionApiErrorAction = {
  error: string;
};

export type UpdateTransactionContents = {
  transactionId: number;
};

export type UpdateTransactionContentRevision = {
  transactionId: number;
  contentId: number;
  revisionId: number;
};

export type ContentsAction = {
  contents: Content[];
};

export type DeleteContent = {
  transactionId: number;
  contentId: number;
};

export type CreateContent = {
  transactionId: number;
  text: string;
};

export type PatchContent = {
  transactionId: number;
  contentId: number;
  text: string;
};

export type UpdateTransactions = {
  projectId: number;
  timezone: string;
  frequencyType?: string;
  ledgerSummaryType: string;
  startDate?: string;
  endDate?: string;
};

export type updateVisibleAction = {
  visible: boolean;
};

export type CreateTransaction = {
  projectId: number;
  amount: number;
  name: string;
  payer: string;
  transactionType: number;
  date: string;
  timezone: string;
  time?: string;
};

export type GetTransaction = {
  transactionId: number;
};

export type TransactionsAction = {
  ledgerSummary: LedgerSummary;
};

export type TransactionAction = {
  transaction?: Transaction;
};

export type DeleteTransaction = {
  transactionId: number;
};

export type updateFrequencyAction = {
  frequencyType: string;
};

export type PatchTransaction = {
  transactionId: number;
  amount: number;
  name: string;
  payer: string;
  transactionType: number;
  date?: string;
  time?: string;
  timezone?: string;
};

export type MoveTransaction = {
  transactionId: number;
  targetProject: number;
  history: History;
};

export type ShareTransaction = {
  targetUser: string;
  transactionId: number;
  targetGroup: number;
  generateLink: boolean;
};

export type SetTransactionLabels = {
  transactionId: number;
  labels: number[];
};
export type UpdateForm = {
  startDate?: string;
  endDate?: string;
  frequencyType?: FrequencyType;
  ledgerSummaryType?: LedgerSummaryType;
  timezone?: string;
};

let initialState = {
  contents: [] as Array<Content>,
  transaction: undefined as Transaction | undefined,
  ledgerSummary: {} as LedgerSummary,
  addTransactionVisible: false,
  //used for form
  startDate: '',
  endDate: '',
  frequencyType: FrequencyType.MONTHLY,
  ledgerSummaryType: LedgerSummaryType.DEFAULT,
  timezone: '',
};

const slice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    transactionsReceived: (
      state,
      action: PayloadAction<TransactionsAction>
    ) => {
      const { ledgerSummary } = action.payload;
      state.ledgerSummary = ledgerSummary;
    },
    transactionReceived: (state, action: PayloadAction<TransactionAction>) => {
      const { transaction } = action.payload;
      state.transaction = transaction;
    },
    UpdateAddTransactionVisible: (
      state,
      action: PayloadAction<updateVisibleAction>
    ) => {
      const { visible } = action.payload;
      state.addTransactionVisible = visible;
    },
    transactionApiErrorReceived: (
      state,
      action: PayloadAction<TransactionApiErrorAction>
    ) => state,
    TransactionsUpdate: (state, action: PayloadAction<UpdateTransactions>) =>
      state,
    TransactionsCreate: (state, action: PayloadAction<CreateTransaction>) =>
      state,
    TransactionGet: (state, action: PayloadAction<GetTransaction>) => state,
    TransactionDelete: (state, action: PayloadAction<DeleteTransaction>) =>
      state,
    TransactionPatch: (state, action: PayloadAction<PatchTransaction>) => state,
    TransactionMove: (state, action: PayloadAction<MoveTransaction>) => state,
    TransactionShare: (state, action: PayloadAction<ShareTransaction>) => state,
    TransactionSetLabels: (
      state,
      action: PayloadAction<SetTransactionLabels>
    ) => state,
    transactionContentsReceived: (
      state,
      action: PayloadAction<ContentsAction>
    ) => {
      const { contents } = action.payload;
      state.contents = contents;
    },
    TransactionContentsUpdate: (
      state,
      action: PayloadAction<UpdateTransactionContents>
    ) => state,
    TransactionContentRevisionUpdate: (
      state,
      action: PayloadAction<UpdateTransactionContentRevision>
    ) => state,
    TransactionContentCreate: (state, action: PayloadAction<CreateContent>) =>
      state,
    TransactionContentDelete: (state, action: PayloadAction<DeleteContent>) =>
      state,
    TransactionContentPatch: (state, action: PayloadAction<PatchContent>) =>
      state,
    TransactionFormUpdate: (state, action: PayloadAction<UpdateForm>) => {
      const {
        startDate,
        endDate,
        frequencyType,
        ledgerSummaryType,
        timezone,
      } = action.payload;
      if (startDate) {
        state.startDate = startDate;
      }
      if (endDate) {
        state.endDate = endDate;
      }
      if (frequencyType) {
        state.frequencyType = frequencyType;
      }
      if (ledgerSummaryType) {
        state.ledgerSummaryType = ledgerSummaryType;
      }
      if (timezone) {
        state.timezone = timezone;
      }
    },
  },
});

export const reducer = slice.reducer;
export const actions = slice.actions;
