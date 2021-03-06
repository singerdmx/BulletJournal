import { createSlice, PayloadAction } from 'redux-starter-kit';
import {
  Transaction,
  LedgerSummary,
  FrequencyType,
  LedgerSummaryType, BankAccount,
} from './interface';
import { History } from 'history';
import { Content } from '../myBuJo/interface';
import {ProjectItemUIType} from "../project/constants";

export type TransactionApiErrorAction = {
  error: string;
};

export type UpdateTransactionContents = {
  transactionId: number;
  updateDisplayMore?: boolean;
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
  diff: string;
};

export type UpdateTransactions = {
  projectId: number;
  timezone: string;
  frequencyType?: string;
  ledgerSummaryType: string;
  startDate?: string;
  endDate?: string;
  labelsToKeep?: number[];
  labelsToRemove?: number[];
};

export type UpdateRecurringTransactions = {
  projectId: number;
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
  date?: string;
  timezone: string;
  location: string;
  labels: number[];
  time?: string;
  recurrenceRule?: string;
  bankAccountId?: number;
  onSuccess?: Function;
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
  type?: ProjectItemUIType;
  dateTime?: string;
  onSuccess?: Function;
};

export type DeleteTransactions = {
  projectId: number;
  transactions: Transaction[];
  type: ProjectItemUIType;
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
  location?: string;
  labels?: number[];
  recurrenceRule?: string;
  bankAccountId?: number;
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

export type GetTransactionsByPayer = {
  projectId: number;
  timezone: string;
  ledgerSummaryType: string;
  frequencyType?: string;
  startDate?: string;
  endDate?: string;
  payer?: string;
};

export type TransactionsByPayerAction = {
  transactionsByPayer: Array<Transaction>;
};

export type RecurringTransactionsAction = {
  transactions: Transaction[];
};

export type BankAccountTransactionsAction = {
  transactions: Transaction[];
};

export type UpdateTransactionColorSettingShownAction = {
  TransactionColorSettingShown: boolean;
};

export type UpdateTransactionColorAction = {
  transactionId: number;
  color: string | undefined;
};

export type UpdateTransactionBankAccountAction = {
  transactionId: number;
  bankAccount: number | undefined;
};

export type ShareTransactionByEmailAction = {
  transactionId: number,
  contents: Content[],
  emails: string[],
  targetUser?: string,
  targetGroup?: number,
};

export type ChangeBankAccountBalanceAction = {
  bankAccount: BankAccount,
  balance: number,
  description: string,
  onSuccess: Function
};

export type GetBankAccountTransactionsAction = {
  bankAccountId: number,
  startDate: string,
  endDate: string
}

let initialState = {
  contents: [] as Array<Content>,
  transaction: undefined as Transaction | undefined,
  ledgerSummary: {} as LedgerSummary,
  addTransactionVisible: true,
  //used for form
  startDate: '',
  endDate: '',
  frequencyType: FrequencyType.MONTHLY,
  ledgerSummaryType: LedgerSummaryType.DEFAULT,
  timezone: '',
  recurringTransactions: [] as Array<Transaction>,
  transactionsByPayer: [] as Array<Transaction>,
  bankAccountTransactions: [] as Array<Transaction>,
  transactionColorSettingShown: false,
};

const slice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    transactionsByPayerReceived: (
      state,
      action: PayloadAction<TransactionsByPayerAction>
    ) => {
      const { transactionsByPayer } = action.payload;
      state.transactionsByPayer = transactionsByPayer;
    },
    recurringTransactionsReceived: (
        state,
        action: PayloadAction<RecurringTransactionsAction>
    ) => {
      const { transactions } = action.payload;
      state.recurringTransactions = transactions;
    },
    bankAccountTransactionsReceived: (
        state,
        action: PayloadAction<BankAccountTransactionsAction>
    ) => {
      const { transactions } = action.payload;
      state.bankAccountTransactions = transactions;
    },
    getTransactionsByPayer: (
      state,
      action: PayloadAction<GetTransactionsByPayer>
    ) => state,
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
    RecurringTransactionsUpdate: (state, action: PayloadAction<UpdateRecurringTransactions>) =>
        state,
    TransactionsCreate: (state, action: PayloadAction<CreateTransaction>) =>
      state,
    TransactionGet: (state, action: PayloadAction<GetTransaction>) => state,
    TransactionDelete: (state, action: PayloadAction<DeleteTransaction>) =>
      state,
    TransactionsDelete: (state, action: PayloadAction<DeleteTransactions>) =>
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
    updateTransactionColorSettingShown: (
      state,
      action: PayloadAction<UpdateTransactionColorSettingShownAction>
    ) => {
      const { TransactionColorSettingShown } = action.payload;
      state.transactionColorSettingShown = TransactionColorSettingShown;
    },
    updateTransactionColor: (
      state,
      action: PayloadAction<UpdateTransactionColorAction>
    ) => state,
    updateTransactionBankAccount: (
        state,
        action: PayloadAction<UpdateTransactionBankAccountAction>
    ) => state,
    TransactionShareByEmail: (state, action: PayloadAction<ShareTransactionByEmailAction>) => state,
    ChangeBankAccountBalance: (state, action: PayloadAction<ChangeBankAccountBalanceAction>) => state,
    GetBankAccountTransactions: (state, action: PayloadAction<GetBankAccountTransactionsAction>) => state,
  },
});

export const reducer = slice.reducer;
export const actions = slice.actions;
