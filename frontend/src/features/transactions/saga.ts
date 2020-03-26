import { takeLatest, call, all, put, select } from 'redux-saga/effects';
import { message } from 'antd';
import {
  actions as transactionsActions,
  TransactionApiErrorAction,
  UpdateTransactions,
  CreateTransaction,
  GetTransaction,
  PatchTransaction,
  MoveTransaction,
  SetTransactionLabels
} from './reducer';
import { IState } from '../../store';
import { PayloadAction } from 'redux-starter-kit';
import {
  fetchTransactions,
  createTransaction,
  getTransactionById,
  updateTransaction,
  moveToTargetProject,
  setTransactionLabels
} from '../../apis/transactionApis';
import { updateTransactions } from './actions';
import { LedgerSummary } from './interface';
import { History } from 'history';

function* transactionApiErrorReceived(
  action: PayloadAction<TransactionApiErrorAction>
) {
  yield call(message.error, `Notice Error Received: ${action.payload.error}`);
}

function* transactionsUpdate(action: PayloadAction<UpdateTransactions>) {
  try {
    const {
      projectId,
      timezone,
      startDate,
      endDate,
      frequencyType,
      ledgerSummaryType
    } = action.payload;

    const data = yield call(
      fetchTransactions,
      projectId,
      timezone,
      frequencyType,
      ledgerSummaryType,
      startDate,
      endDate
    );
    const ledgerSummary: LedgerSummary = yield data.json();

    yield put(
      transactionsActions.transactionsReceived({
        ledgerSummary: ledgerSummary,
        timezone: timezone,
        frequencyType: frequencyType,
        ledgerSummaryType: ledgerSummaryType
      })
    );
  } catch (error) {
    yield call(message.error, `Transaction Error Received: ${error}`);
  }
}

function* transactionCreate(action: PayloadAction<CreateTransaction>) {
  try {
    const {
      projectId,
      amount,
      name,
      payer,
      transactionType,
      date,
      timezone,
      time
    } = action.payload;
    const data = yield call(
      createTransaction,
      projectId,
      amount,
      name,
      payer,
      transactionType,
      date,
      timezone,
      time
    );
    const state: IState = yield select();
    const transaction = state.transaction;
    yield put(
      updateTransactions(
        projectId,
        timezone,
        transaction.frequencyType,
        transaction.ledgerSummaryType,
        transaction.startDate,
        transaction.endDate
      )
    );
  } catch (error) {
    yield call(message.error, `transactionCreate Error Received: ${error}`);
  }
}

function* transactionMove(action: PayloadAction<MoveTransaction>) {
  try {
    const { transactionId, targetProject, history } = action.payload;
    yield call(moveToTargetProject, transactionId, targetProject);
    yield call(message.success, 'Transaction moved successfully');
    history.push(`/projects/${targetProject}`);
  } catch (error) {
    yield call(message.error, `transactionMove Error Received: ${error}`);
  }
}

function* getTransaction(action: PayloadAction<GetTransaction>) {
  try {
    const data = yield call(getTransactionById, action.payload.transactionId);
    yield put(transactionsActions.transactionReceived({ transaction: data }));
  } catch (error) {
    yield call(message.error, `Get Transaction Error Received: ${error}`);
  }
}

function* patchTransaction(action: PayloadAction<PatchTransaction>) {
  try {
    yield call(
      updateTransaction,
      action.payload.transactionId,
      action.payload.amount,
      action.payload.name,
      action.payload.payer,
      action.payload.transactionType,
      action.payload.date,
      action.payload.time,
      action.payload.timezone
    );
  } catch (error) {
    yield call(message.error, `Patch Transaction Error Received: ${error}`);
  }
}

function* transactionSetLabels(action: PayloadAction<SetTransactionLabels>) {
  try {
    const { transactionId, labels } = action.payload;
    const data = yield call(setTransactionLabels, transactionId, labels);
    // yield put(updateTransactions(data.projectId));
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
    yield takeLatest(transactionsActions.TransactionGet.type, getTransaction),
    yield takeLatest(
      transactionsActions.TransactionPatch.type,
      patchTransaction
    ),
    yield takeLatest(transactionsActions.TransactionMove.type, transactionMove),
    yield takeLatest(
      transactionsActions.TransactionSetLabels.type,
      transactionSetLabels
    )
  ]);
}
