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
  GetTransactionsByPayer,
  DeleteTransactions,
} from './reducer';
import { IState } from '../../store';
import { PayloadAction } from 'redux-starter-kit';
import {
  fetchTransactions,
  createTransaction,
  getTransactionById,
  updateTransaction,
  deleteTransactionById,
  deleteTransactions as deleteTransactionsApi,
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
import { Content, Revision, ProjectItems } from '../myBuJo/interface';
import { updateItemsByLabels } from '../label/actions';

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
      ledgerSummaryType,
      frequencyType,
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
      labels,
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
      labels,
      time
    );

    const state: IState = yield select();
    const data = yield call(
      fetchTransactions,
      projectId,
      state.transaction.timezone,
      state.transaction.ledgerSummaryType,
      state.transaction.frequencyType,
      state.transaction.startDate,
      state.transaction.endDate
    );
    const ledgerSummary: LedgerSummary = yield data.json();
    yield put(
      transactionsActions.transactionsReceived({
        ledgerSummary: ledgerSummary,
      })
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
    yield call(message.error, 'Transaction Unavailable');
  }
}

function* deleteTransaction(action: PayloadAction<DeleteTransaction>) {
  try {
    const { transactionId } = action.payload;
    const state: IState = yield select();
    const transaction = yield call(getTransactionById, transactionId);

    yield put(
      transactionsActions.transactionReceived({ transaction: undefined })
    );
    yield call(deleteTransactionById, transactionId);

    const data = yield call(
      fetchTransactions,
      transaction.projectId,
      state.transaction.timezone,
      state.transaction.ledgerSummaryType,
      state.transaction.frequencyType,
      state.transaction.startDate,
      state.transaction.endDate
    );
    const ledgerSummary: LedgerSummary = yield data.json();
    yield put(
      transactionsActions.transactionsReceived({
        ledgerSummary: ledgerSummary,
      })
    );

    yield put(
      getProjectItemsAfterUpdateSelect(
        state.myBuJo.todoSelected,
        state.myBuJo.ledgerSelected,
        state.myBuJo.noteSelected,
        'today'
      )
    );
    const labelItems: ProjectItems[] = [];
    state.label.items.forEach((projectItem: ProjectItems) => {
      projectItem = { ...projectItem };
      if (projectItem.transactions) {
        projectItem.transactions = projectItem.transactions.filter(
          (transaction) => transaction.id !== transactionId
        );
      }
      labelItems.push(projectItem);
    });
    yield put(updateItemsByLabels(labelItems));

    const transactionsByPayer = state.transaction.transactionsByPayer.filter(
      (t) => t.id !== transactionId
    );
    yield put(
      transactionsActions.transactionsByPayerReceived({
        transactionsByPayer: transactionsByPayer,
      })
    );
  } catch (error) {
    yield call(message.error, `Delete Transaction Error Received: ${error}`);
  }
}

function* deleteTransactions(action: PayloadAction<DeleteTransactions>) {
  try {
    const { projectId, transactionsId } = action.payload;
    const state: IState = yield select();

    yield put(
      transactionsActions.transactionReceived({ transaction: undefined })
    );
    yield call(deleteTransactionsApi, projectId, transactionsId);

    const data = yield call(
      fetchTransactions,
      projectId,
      state.transaction.timezone,
      state.transaction.ledgerSummaryType,
      state.transaction.frequencyType,
      state.transaction.startDate,
      state.transaction.endDate
    );
    const ledgerSummary: LedgerSummary = yield data.json();
    yield put(
      transactionsActions.transactionsReceived({
        ledgerSummary: ledgerSummary,
      })
    );

    yield put(
      getProjectItemsAfterUpdateSelect(
        state.myBuJo.todoSelected,
        state.myBuJo.ledgerSelected,
        state.myBuJo.noteSelected,
        'today'
      )
    );

    const labelItems: ProjectItems[] = [];
    state.label.items.forEach((projectItem: ProjectItems) => {
      projectItem = { ...projectItem };
      if (projectItem.transactions) {
        projectItem.transactions = projectItem.transactions.filter(
          (transaction) => !transactionsId.includes(transaction.id)
        );
      }
      labelItems.push(projectItem);
    });
    yield put(updateItemsByLabels(labelItems));

    const transactionsByPayer = state.transaction.transactionsByPayer.filter(
      (t) => !transactionsId.includes(t.id)
    );
    yield put(
      transactionsActions.transactionsByPayerReceived({
        transactionsByPayer: transactionsByPayer,
      })
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
    const projectId = data.projectId;
    const state: IState = yield select();
    //update transaciton project page's detail transaction
    if (state.transaction.timezone) {
      const updateData = yield call(
        fetchTransactions,
        projectId,
        state.transaction.timezone,
        state.transaction.ledgerSummaryType,
        state.transaction.frequencyType,
        state.transaction.startDate,
        state.transaction.endDate
      );
      const ledgerSummary: LedgerSummary = yield updateData.json();
      yield put(
        transactionsActions.transactionsReceived({
          ledgerSummary: ledgerSummary,
        })
      );
    }

    yield put(
      transactionsActions.transactionReceived({
        transaction: data,
      })
    );
    yield put(
      getProjectItemsAfterUpdateSelect(
        state.myBuJo.todoSelected,
        state.myBuJo.ledgerSelected,
        state.myBuJo.noteSelected,
        'today'
      )
    );

    //update transaction label search page
    const transaction = yield call(getTransactionById, transactionId);
    const labelItems: ProjectItems[] = [];
    state.label.items.forEach((projectItem: ProjectItems) => {
      projectItem = { ...projectItem };
      if (projectItem.transactions) {
        projectItem.transactions = projectItem.transactions.map(
          (eachTransaction) => {
            if (eachTransaction.id === transactionId) return transaction;
            else return eachTransaction;
          }
        );
      }
      labelItems.push(projectItem);
    });
    yield put(updateItemsByLabels(labelItems));
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

    const targetContent: Content = state.transaction.contents.find(
      (c) => c.id === contentId
    )!;
    const revision: Revision = targetContent.revisions.find(
      (r) => r.id === revisionId
    )!;

    if (!revision.content) {
      const data = yield call(
        getContentRevision,
        transactionId,
        contentId,
        revisionId
      );

      const transactionContents: Content[] = [];
      state.transaction.contents.forEach((transactionContent) => {
        if (transactionContent.id === contentId) {
          const newRevisions: Revision[] = [];
          transactionContent.revisions.forEach((revision) => {
            if (revision.id === revisionId) {
              revision = { ...revision, content: data.content };
            }
            newRevisions.push(revision);
          });
          transactionContent = {
            ...transactionContent,
            revisions: newRevisions,
          };
        }
        transactionContents.push(transactionContent);
      });

      yield put(
        transactionsActions.transactionContentsReceived({
          contents: transactionContents,
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

function* getTransactionsByPayer(
  action: PayloadAction<GetTransactionsByPayer>
) {
  try {
    const {
      projectId,
      timezone,
      ledgerSummaryType,
      frequencyType,
      startDate,
      endDate,
      payer,
    } = action.payload;
    const data = yield call(
      fetchTransactions,
      projectId,
      timezone,
      ledgerSummaryType,
      frequencyType,
      startDate,
      endDate,
      payer
    );
    const transactionsByPayer = yield data.json();
    yield put(
      transactionsActions.transactionsByPayerReceived({
        transactionsByPayer: transactionsByPayer,
      })
    );
  } catch (error) {
    yield call(
      message.error,
      `getTransactionsByPayer Error Received: ${error}`
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
      transactionsActions.TransactionsDelete.type,
      deleteTransactions
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
    yield takeLatest(
      transactionsActions.getTransactionsByPayer.type,
      getTransactionsByPayer
    ),
  ]);
}
