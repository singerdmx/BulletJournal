import { takeLatest, call, all, put } from 'redux-saga/effects';
import { message } from 'antd';
import {
  actions as transactionsActions,
  TransactionApiErrorAction,
  UpdateTransactions,
  CreateTransaction,
  GetTransaction,
  PatchTransaction,
  SetTransactionLabels
} from './reducer';
import { PayloadAction } from 'redux-starter-kit';
import {
  fetchTransactions, createTransaction, getTransactionById, updateTransaction, setTransactionLabels
} from '../../apis/transactionApis';
import { updateTransactions } from './actions';

function* transactionApiErrorReceived(action: PayloadAction<TransactionApiErrorAction>) {
  yield call(message.error, `Notice Error Received: ${action.payload.error}`);
}

function* transactionsUpdate(action: PayloadAction<UpdateTransactions>) {
  try {
    const data = yield call(fetchTransactions, action.payload.projectId);
    const transactions = yield data.json();

    yield put(
        transactionsActions.transactionsReceived({
        transactions: transactions
      })
    );
  } catch (error) {
    yield call(message.error, `Transaction Error Received: ${error}`);
  }
}

function* transactionCreate(action: PayloadAction<CreateTransaction>) {
    try {
      const data = yield call(createTransaction, action.payload.projectId,
      action.payload.amount, action.payload.name, action.payload.payer,
      action.payload.transactionType, action.payload.date, action.payload.time,
      action.payload.timezone);
      const transaction = yield data.json();
      yield put(updateTransactions(action.payload.projectId));
    } catch (error) {
      yield call(message.error, `Transaction Error Received: ${error}`);
    }
  }

function* getTransaction(action: PayloadAction<GetTransaction>) {
  try {
    const data = yield call(getTransactionById, action.payload.transactionId);
  } catch (error) {
    yield call(message.error, `Get Transaction Error Received: ${error}`);
  }
}

function* patchTransaction(action: PayloadAction<PatchTransaction>) {
  try {
    yield call(updateTransaction, action.payload.transactionId, action.payload.amount,
    action.payload.name, action.payload.payer, action.payload.transactionType,
    action.payload.date, action.payload.time, action.payload.timezone);
  } catch (error) {
    yield call(message.error, `Patch Transaction Error Received: ${error}`);
  }
}

function* transactionSetLabels(action: PayloadAction<SetTransactionLabels>) {
  try {
    const { transactionId, labels } = action.payload;
    const data = yield call(setTransactionLabels, transactionId, labels);
    yield put(updateTransactions(data.projectId));
  } catch (error) {
    yield call(message.error, `transactionSetLabels Error Received: ${error}`);
  }
}

export default function* transactionSagas() {
  yield all([
    yield takeLatest(
      transactionsActions.transactionApiErrorReceived.type,
      transactionApiErrorReceived
    ),
    yield takeLatest(
      transactionsActions.TransactionsUpdate.type,
      transactionsUpdate
    ),
    yield takeLatest(
        transactionsActions.TransactionsCreate.type,
        transactionCreate
    ),
    yield takeLatest(
          transactionsActions.TransactionGet.type,
          getTransaction
    ),
    yield takeLatest(
      transactionsActions.TransactionPatch.type,
      patchTransaction
    ),
    yield takeLatest(
      transactionsActions.TransactionSetLabels.type,
      transactionSetLabels
    ),
  ]);
}