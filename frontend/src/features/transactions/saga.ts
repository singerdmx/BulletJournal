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
  SetTransactionLabels,
  ShareTransaction,
  DeleteTransaction,
  CreateContent,
  DeleteContent,
  PatchContent,
  UpdateTransactionContentRevision,
  UpdateTransactionContents,
} from './reducer';
import { IState } from '../../store';
import { PayloadAction } from 'redux-starter-kit';
import {
  fetchTransactions,
  createTransaction,
  getTransactionById,
  updateTransaction,
  deleteTransactionById,
  moveToTargetProject,
  setTransactionLabels,
  shareTransactionWithOther,
  deleteContent,
  addContent,
  getContents,
  updateContent,
  getContentRevision,
} from '../../apis/transactionApis';
import { LedgerSummary } from './interface';
import { getProjectItemsAfterUpdateSelect } from '../myBuJo/actions';
import { updateTransactionContents } from './actions';
import { Content, Revision } from '../myBuJo/interface';

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
      ledgerSummaryType,
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
      time,
    } = action.payload;
    yield call(
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

function* shareTransaction(action: PayloadAction<ShareTransaction>) {
  try {
    const {
      transactionId,
      targetUser,
      targetGroup,
      generateLink,
    } = action.payload;
    yield call(
      shareTransactionWithOther,
      transactionId,
      targetUser,
      targetGroup,
      generateLink
    );
    yield call(message.success, 'Transaction shared successfully');
  } catch (error) {
    yield call(message.error, `shareTransaction Error Received: ${error}`);
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

function* deleteTransaction(action: PayloadAction<DeleteTransaction>) {
  try {
    const { transactionId } = action.payload;
    yield call(deleteTransactionById, transactionId);

    const state: IState = yield select();

    yield put(
      getProjectItemsAfterUpdateSelect(
        state.myBuJo.todoSelected,
        state.myBuJo.ledgerSelected,
        'today'
      )
    );
  } catch (error) {
    yield call(message.error, `Delete Transaction Error Received: ${error}`);
  }
}

function* patchTransaction(action: PayloadAction<PatchTransaction>) {
  try {
    const {
      transactionId,
      amount,
      name,
      payer,
      transactionType,
      date,
      time,
      timezone,
    } = action.payload;
    const data = yield call(
      updateTransaction,
      transactionId,
      amount,
      name,
      payer,
      transactionType,
      date,
      time,
      timezone
    );

    yield put(
      transactionsActions.transactionReceived({
        transaction: data,
      })
    );

    const state: IState = yield select();

    yield put(
      getProjectItemsAfterUpdateSelect(
        state.myBuJo.todoSelected,
        state.myBuJo.ledgerSelected,
        'today'
      )
    );
  } catch (error) {
    yield call(message.error, `Patch Transaction Error Received: ${error}`);
  }
}

function* transactionSetLabels(action: PayloadAction<SetTransactionLabels>) {
  try {
    const { transactionId, labels } = action.payload;
    const data = yield call(setTransactionLabels, transactionId, labels);
    yield put(transactionsActions.transactionReceived({ transaction: data }));
  } catch (error) {
    yield call(message.error, `transactionSetLabels Error Received: ${error}`);
  }
}

function* createTransactionContent(action: PayloadAction<CreateContent>) {
  try {
    const { transactionId, text } = action.payload;
    yield call(addContent, transactionId, text);
    yield put(updateTransactionContents(transactionId));
  } catch (error) {
    yield call(
      message.error,
      `createTransactionContent Error Received: ${error}`
    );
  }
}

function* transactionContentsUpdate(
  action: PayloadAction<UpdateTransactionContents>
) {
  try {
    const contents = yield call(getContents, action.payload.transactionId);
    yield put(
      transactionsActions.transactionContentsReceived({
        contents: contents,
      })
    );
  } catch (error) {
    yield call(
      message.error,
      `transactionContentsUpdate Error Received: ${error}`
    );
  }
}

function* transactionContentRevisionUpdate(
  action: PayloadAction<UpdateTransactionContentRevision>
) {
  try {
    const { transactionId, contentId, revisionId } = action.payload;
    const state: IState = yield select();

    const contents: Content[] = state.transaction.contents;
    const targetContent: Content = contents.filter(
      (c) => c.id === contentId
    )[0];
    const revision: Revision = targetContent.revisions.filter(
      (r) => r.id === revisionId
    )[0];

    if (!revision.content) {
      const content = yield call(
        getContentRevision,
        transactionId,
        contentId,
        revisionId
      );
      revision.content = content;

      yield put(
        transactionsActions.transactionContentsReceived({
          contents: contents,
        })
      );
    }
  } catch (error) {
    yield call(
      message.error,
      `transactionContentRevisionUpdate Error Received: ${error}`
    );
  }
}

function* patchContent(action: PayloadAction<PatchContent>) {
  try {
    const { transactionId, contentId, text } = action.payload;
    const contents = yield call(updateContent, transactionId, contentId, text);
    yield put(
      transactionsActions.transactionContentsReceived({
        contents: contents,
      })
    );
  } catch (error) {
    yield call(message.error, `Patch Content Error Received: ${error}`);
  }
}

function* deleteTransactionContent(action: PayloadAction<DeleteContent>) {
  try {
    const { transactionId, contentId } = action.payload;
    const data = yield call(deleteContent, transactionId, contentId);
    const contents = yield data.json();
    yield put(
      transactionsActions.transactionContentsReceived({
        contents: contents,
      })
    );
  } catch (error) {
    yield call(
      message.error,
      `transactionContentDelete Transaction Error Received: ${error}`
    );
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
      transactionsActions.TransactionShare.type,
      shareTransaction
    ),
    yield takeLatest(
      transactionsActions.TransactionDelete.type,
      deleteTransaction
    ),
    yield takeLatest(
      transactionsActions.TransactionSetLabels.type,
      transactionSetLabels
    ),
    yield takeLatest(
      transactionsActions.TransactionContentsUpdate.type,
      transactionContentsUpdate
    ),
    yield takeLatest(
      transactionsActions.TransactionContentRevisionUpdate.type,
      transactionContentRevisionUpdate
    ),
    yield takeLatest(
      transactionsActions.TransactionContentCreate.type,
      createTransactionContent
    ),
    yield takeLatest(
      transactionsActions.TransactionContentPatch.type,
      patchContent
    ),
    yield takeLatest(
      transactionsActions.TransactionContentDelete.type,
      deleteTransactionContent
    ),
  ]);
}
